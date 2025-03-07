import express from "express";
import { Server } from "socket.io";
import http from "http";
import { Socket } from "dgram";

const app = express()
const server =  http.createServer(app)
const io = new Server((server),{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET","POST"]
    }
})
const userSocketMap = {}
export const getReciverSocketId = (userId) => userSocketMap[userId]
io.on('connection',(socket)=>{
    console.log('a user connected',socket.id)

    const userId = socket.handshake.query.userId
    if(userId){
        userSocketMap[userId] = socket.id
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
    console.log('a user disconnected',socket.id)
    if(userId){
        delete userSocketMap[userId]
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
})

export {io,server,app}