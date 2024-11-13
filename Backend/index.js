import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import DBConnect from './Utils/DBConnect.js';
import chatsRouter from './routes/chatsRouter.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware configuration
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }));
app.options('*', cors());
DBConnect();
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/chats', chatsRouter);

app.get('/', (req, res) => res.send('Hello World'));

// Socket.IO connection event
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for a chat message
    socket.on('sendMessage', (messageData) => {
        socket.broadcast.emit('receiveMessage', messageData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server on specified port
httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port http:${process.env.PORT}`);
});
