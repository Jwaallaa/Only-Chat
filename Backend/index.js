import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import DBConnect from "./Utils/DBConnect.js";
import chatsRouter from "./routes/chatsRouter.js";
import { Server } from "socket.io";
import http from 'http'
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://only-chat.onrender.com", // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Handle preflight requests
app.options("*", cors()); // This allows the server to respond to preflight requests

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for specific client URLs in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for join chat event
  socket.on("joinChat", (chatId) => {
    socket.join(chatId); // User joins a specific chat room
    console.log(`User joined chat: ${chatId}`);
  });
  // Listen for a new message
  socket.on("sendMessage", (chat) => {
    const recieverId = chat.reciever;
    const message = chat.text;
    io.to(recieverId).emit("receiveMessage", message); // Send message to all users in the chat room
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Configure CORS to allow requests from your frontend



// Connect to the database
DBConnect();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define API routes
app.use("/api/user", userRouter);
app.use("/api/chats", chatsRouter);

// Default route for testing server status
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server and listen on the specified port
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port http:${process.env.PORT}`);
});

export default app;
