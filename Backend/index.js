import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import DBConnect from './Utils/DBConnect.js';
import chatsRouter from './routes/chatsRouter.js'

const app = express();

app.use(cors())
DBConnect();

app.use(express.json());
app.use('/api/user' , userRouter);
app.use('/api/chats' , chatsRouter)



app.get('/' ,(req , res)=>{
    res.send('Hello World')
})


app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port no. http:${process.env.PORT}`)
})

export default app;