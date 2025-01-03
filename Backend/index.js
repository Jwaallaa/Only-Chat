import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import DBConnect from "./Utils/DBConnect.js";
import chatsRouter from "./routes/chatsRouter.js";
import User from "./models/userModel.js"; // Assuming you have a User schema

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
  }// Optional: Send a ping every 25 seconds
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

  //setup
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log('connected successfully' , userData._id);
  })
  
  // Join a room
  // socket.on("joinRoom", (chatId) => {
  //   socket.join(chatId);
  //   console.log(`User joined room: ${chatId}`);
  // });

  // Send a message
  socket.on("sendMessage",async (message) => {
    console.log("Message received:", message.text);

    const sendername = await User.findById(message.sender).select("username");
    const receivername = await User.findById(message.receiver).select("username");

    const updatedMessage = {
      ...message,
      sender: {
          _id: message.sender,
          username: sendername,
      },
      receiver: {
          _id: message.receiver,
          username: receivername,
      },
  };
    console.log('sending' ,updatedMessage.text)
    socket.to(message.receiver).emit("receiveMessage", updatedMessage);
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





