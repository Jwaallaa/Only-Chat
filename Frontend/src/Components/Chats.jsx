import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserCard from "./UserCard";
import "./Chats.css";
import SingleChat from "./SingleChat";
import { io } from "socket.io-client";

const socket = io('https://only-chat.onrender.com'); // Connect to your Socket.IO server

const Chats = () => {
    const [searchbox, setsearchbox] = useState("");
    const [chats, setChats] = useState([]);
    const [friendName, setFriendName] = useState("");
    const [Chathistory, setChathistory] = useState([]);
    const [usersearch, setUsersearch] = useState([]);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const navigate = useNavigate();

    // Fetch chats and chat history as before

    // Send a message to the server
    const sendMessage = (messageContent) => {
        const messageData = {
            sender: userInfo.username,
            receiver: friendName,
            content: messageContent,
            timestamp: new Date().toISOString(),
        };
        socket.emit('sendMessage', messageData); // Emit message to server
        setChathistory([...Chathistory, messageData]); // Add message locally
    };

    // Receive messages from the server
    useEffect(() => {
        socket.on('receiveMessage', (messageData) => {
            setChathistory((prev) => [...prev, messageData]); // Update chat history with new message
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    return !userInfo || !userInfo.token ? (
        <div className="noLogin">
            <h2>First, log in to see your chats.</h2>
            <button onClick={() => navigate("/Only-Chat")}>Go to Login Page</button>
        </div>
    ) : (
        <>
            {/* ... your other JSX components like Navbar, UserCard ... */}
            <SingleChat
                friendName={friendName}
                Chathistory={Chathistory}
                setFriendName={setFriendName}
                setChathistory={setChathistory}
                sendMessage={sendMessage} // Pass sendMessage to SingleChat
            />
        </>
    );
};

export default Chats;
