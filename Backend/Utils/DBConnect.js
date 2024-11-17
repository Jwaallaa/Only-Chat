import mongoose from "mongoose";
import dotenv from "dotenv";


// Load environment variables from .env file
dotenv.config();
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Connect to MongoDB

const DBConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI , clientOptions)
        console.log("Connected to MongoDB");
        } catch (error) {
            console.log("Error connecting to MongoDB:", error.message); 
        }
    }

export default DBConnect;