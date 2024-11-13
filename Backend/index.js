import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/userRouter.js';
import DBConnect from './Utils/DBConnect.js';
import chatsRouter from './routes/chatsRouter.js';

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
    cors: {
        origin: '*', // Allow your frontend's URL here
        methods: ["GET", "POST"]
    }
});

// Middleware and route setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.options('*', cors());
DBConnect();
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/chats', chatsRouter);

// Socket.IO configuration
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room based on user ID or chat ID
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // Handle message event
    socket.on('send_message', (data) => {
        io.to(data.room).emit('receive_message', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port http:${process.env.PORT}`);
});
