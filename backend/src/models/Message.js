import mongoose from "mongoose";
import Joi from "joi";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message:{
        type: String,
        required: true
    }
}, {
    timestamps: true,
});
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });


function validateSendMessage(obj) {
    const schema = Joi.object({
        message: Joi.string().required(),
    }).strict();
    return schema.validate(obj);
}
const Message = mongoose.model("Message", messageSchema);

export default Message;
export {validateSendMessage}