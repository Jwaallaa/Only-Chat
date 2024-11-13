import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io('https://only-chat.onrender.com');

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState("");
    const [roomId, setRoomId] = useState(""); // Unique room for each chat

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setChats((prevChats) => [...prevChats, data]);
        });
    }, []);

    const sendMessage = () => {
        const messageData = {
            room: roomId,
            message: message,
            time: new Date().toLocaleTimeString(),
        };
        socket.emit("send_message", messageData);
        setChats([...chats, messageData]);
        setMessage("");
    };

    return (
        <div>
            <div>
                {chats.map((chat, index) => (
                    <p key={index}>{chat.message}</p>
                ))}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
};
