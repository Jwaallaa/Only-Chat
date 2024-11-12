import mongoose, { mongo } from "mongoose";

const chatModel = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // For direct messages
  text: { type: String, required: true },
  
}, {
    timestamps: true,
})

const Chat = mongoose.model('Chat', chatModel);

export default Chat;