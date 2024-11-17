import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Express app and HTTP server setup
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example chat and user models
const Chat = mongoose.model("Chat", new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
}));

const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}));

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a room
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  // Send a message
  socket.on("sendMessage", async (message) => {
    console.log("Message received:", message);

    // Save message to the database
    const newMessage = await Chat.create({
      sender: message.senderId,
      receiver: message.receiverId,
      text: message.text,
    });

    // Emit the message to the room
    io.to(message.chatId).emit("receiveMessage", newMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Routes (Add your existing API routes here)
app.get("/", (req, res) => {
  res.send("Backend running with Socket.IO!");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
