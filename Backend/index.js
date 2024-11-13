import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import DBConnect from './Utils/DBConnect.js';
import chatsRouter from './routes/chatsRouter.js';

const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'https://jwaallaa.github.io', // Your GitHub Pages frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other HTTP methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true // If you're using cookies or authorization headers
}));

// Handle preflight requests
app.options('*', cors()); // This allows the server to respond to preflight requests

// Connect to the database
DBConnect();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define API routes
app.use('/api/user', userRouter);
app.use('/api/chats', chatsRouter);

// Default route for testing server status
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http:${process.env.PORT}`);
});

export default app;