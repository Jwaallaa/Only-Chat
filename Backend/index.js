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
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // Disable credentials since all origins are allowed
  })
);

// Handle preflight requests
app.options("*", cors()); // This allows the server to respond to preflight requests





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
