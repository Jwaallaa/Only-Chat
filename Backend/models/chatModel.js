import mongoose, { mongo } from "mongoose";

const chatModel = new mongoose.Schema(
  {
    chatId: { type: String, required: true }, // Unique identifier for the chat between two users

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // For direct messages
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

chatModel.pre("save", function (next) {
  if (!this.chatId) {
    this.chatId = [this.sender.toString(), this.receiver.toString()]
      .sort()
      .join("-");
  }
  next();
});

const Chat = mongoose.model("Chat", chatModel);

export default Chat;
