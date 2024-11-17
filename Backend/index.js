import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import DBConnect from "./Utils/DBConnect.js";
import chatsRouter from "./routes/chatsRouter.js";
import Chat from "./models/chatModel.js";
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
  pingTimeout: 60000,
  pingInterval: 25000, // Optional: Send a ping every 25 seconds
});

// Middleware
app.use(cors());
app.use(express.json());

app.options("*", cors());

// MongoDB connection
DBConnect();

// Example chat and user models


// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  
  // Join a room
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  // Send a message
  socket.on("sendMessage",(message) => {
    console.log("Message received:", message.text);
    if (!message || !message.chatId || !message.text) {
      console.error("Invalid message format", message);
      return;}
    // Emit the message to the room
    socket.to(message.chatId).emit("receiveMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Routes (Add your existing API routes here)
app.use("/api/user", userRouter);
app.use("/api/chats", chatsRouter);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));