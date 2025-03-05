import User from '../models/User.js';
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import { validateSendMessage } from '../models/Message.js';
import {io, getReciverSocketId } from '../socket/socket.js';
export const getMessagesCtrl = async (req, res) => {
    try {
        if(!req.user._id|| !req.user) return res.status(401).json({ error: "user not authenticated" });
        const { id: recieverId } = req.params
        const senderId = req.user._id
        if (senderId.equals(recieverId)) {
            return res.status(400).json({ error: "you can't send message to yourself" });
        }
        const recieverIdExist = await User.findById(recieverId)
        if (!recieverIdExist) {
            return res.status(404).json({ error: "reciever not found" });
        }
        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, recieverId]
            }
        }).populate("messages")
        if (!conversation) {
            return res.status(404).json([]);
        }
        const messages = conversation.messages
        return res.status(200).json(messages)
    } catch (error) {
        console.error("error in getMessagesCtrl", error);
        res.status(500).json({ error: error.message });
    }
}

export const sendMessageCtrl = async (req, res) => {
    try {
        const { error } = validateSendMessage(req.body)
        if (error) return res.status(400).json({ error: error.details[0].message })
        if(!req.user._id|| !req.user) return res.status(401).json({ error: "user not authenticated" });
        const { message } = req.body
        const { id: recieverId } = req.params
        const senderId = req.user._id
        if (senderId === recieverId) {
            return res.status(400).json({ error: "you can't send message to yourself" });
        }
        const recieverIdExist = await User.findById(recieverId)
        if (!recieverIdExist) {
            return res.status(404).json({ error: "reciever not found" });
        }
        let conversation;
        conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, recieverId]
            }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId]

            })
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        })
        if (newMessage) {
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }
        const recieverSocket = getReciverSocketId(recieverId)
        if (recieverSocket) {
            io.to(recieverSocket).emit("newMessage", newMessage)
        }
        return res.status(200).json(newMessage)
    } catch (error) {
        console.error("error in sendMessageCtrl", error);
        res.status(500).json({ error: error.message });
    }
}