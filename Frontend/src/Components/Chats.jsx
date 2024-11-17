import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserCard from "./UserCard";
import "./Chats.css";
import SingleChat from "./SingleChat";
import io from "socket.io-client";

// Setup Socket.IO connection to the server
const socket = io("https://only-chat.onrender.com");

const Chats = () => {
  const [searchbox, setsearchbox] = useState("");
  const [chats, setChats] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [Chathistory, setChathistory] = useState([]);
  const navigate = useNavigate();
  const [usersearch, setUsersearch] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSingleChat, setShowSingleChat] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [socketmessage, setSocketmessage] = useState({})
  const [socketsent , setSocketsent] = useState(true);

  // Fetch chats
  const fetchChats = async () => {
    if (!userInfo || !userInfo.token) return;

    const token = userInfo.token;

    try {
      const response = await fetch("https://only-chat.onrender.com/api/chats", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Fetch chat history for a selected user
  const SelectedUserChat = async (username) => {
    setChatLoading(true);
    const token = userInfo.token;

    try {
      const response = await fetch(
        `https://only-chat.onrender.com/api/chats/${username}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      setChathistory(data);
      setFriendName(username);
      setChatLoading(false);
      setNewMessage(false);
      if (isMobile) setShowSingleChat(true); // Show single chat view on mobile

      socket.emit('joinRoom' , data[0].chatId )
    } catch (error) {
      console.error("Error fetching chats with selected user:", error);
      setChatLoading(false);
    }
  };

  // Handle resizing to update mobile view detection
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle incoming messages via Socket.IO
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      // Update the chat history with the new message
      console.log(message)
      setChathistory((Chathistory)=> [...Chathistory, message])
    });

    return () => {
      socket.off("receiveMessage");
    };
  });

  // Emit message to Socket.IO server

useEffect(() => {
  socket.emit("sendMessage", socketmessage);
},[socketsent])

  
  // Send the message to the receiver's socket
  
  


  useEffect(() => {

    fetchChats();
  }, [newMessage]);

  const handleLoginRedirect = () => {
    navigate("/Only-Chat");
  };

  const getLatestMessage = (username) => {
    const userChats = chats.filter(
      (chat) =>
        (chat.sender.username === username || chat.receiver.username === username) &&
      (chat.sender._id === userInfo._id || chat.receiver._id === userInfo._id)
    );

    if (userChats.length > 0) {
      userChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date
      return userChats[0].text;
    }
    return "No messages yet";
  };

  const getUniqueChats = () => {
    const chatMap = new Map();

    chats.forEach((chat) => {
      const userPairKey =
        chat.sender._id < chat.receiver._id
          ? `${chat.sender._id}-${chat.receiver._id}`
          : `${chat.receiver._id}-${chat.sender._id}`;

      if (
        chatMap.has(userPairKey) &&
        new Date(chatMap.get(userPairKey).createdAt) > new Date(chat.createdAt)
      ) {
        return;
      }

      chatMap.set(userPairKey, chat);
    });

    const uniqueChats = Array.from(chatMap.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return uniqueChats;
  };

  return !userInfo || !userInfo.token ? (
    <div className="noLogin">
      <h2>First, log in to see your chats.</h2>
      <button onClick={handleLoginRedirect}>Go to Login Page</button>
    </div>
  ) : (
    <>
      <Navbar
        setUsersearch={setUsersearch}
        setSearch={setSearch}
        setLoading={setLoading}
        searchbox={searchbox}
        setsearchbox={setsearchbox}
      />

      <div className={`searchedusers ${search ? "show" : ""}`}>
        <div className="innerbox">
          <div>
            <h1>Users</h1>
            <i
              onClick={() => {
                setSearch(false);
                setLoading(false);
                setsearchbox("");
              }}
              className="fa-duotone fa-solid fa-xmark"
            ></i>
          </div>
          {loading ? (
            <div className="spinner"></div>
          ) : usersearch.length > 0 ? (
            usersearch.map((suser) => (
              <div key={suser._id}>
                <UserCard
                  username={suser.name}
                  latestMessage={getLatestMessage(suser.username)}
                  onClick={() => {
                    SelectedUserChat(suser.username);
                    setSearch(false);
                    setShowSingleChat(true);
                  }}
                />
              </div>
            ))
          ) : (
            <h3>No results found</h3>
          )}
        </div>
      </div>

      <div className="chatpage">
        {/* For Laptop/Desktop, show both chats and single chat */}
        { !isMobile ? (
          <>
            <div className="chatscontainer">
              <h2>Chats</h2>
              {loading ? (
                <div className="spinner"></div>
              ) : chats.length > 0 ? (
                getUniqueChats().map((chat) => {
                  const isSenderLoggedInUser =
                    chat.sender._id === userInfo._id;
                  return (
                    <div key={chat._id} onClick={() => SelectedUserChat(isSenderLoggedInUser ? chat.receiver.username : chat.sender.username)}>
                      <UserCard
                        username={isSenderLoggedInUser ? chat.receiver.username : chat.sender.username}
                        latestMessage={chat.text}
                      />
                    </div>
                  );
                })
              ) : (
                <div>No Chats Available</div>
              )}
            </div>

            {showSingleChat && (
              <SingleChat
                friendName={friendName}
                Chathistory={Chathistory}
                setNewMessage={setNewMessage}
                setFriendName={setFriendName}
                loading={chatLoading}
                showSingleChat={showSingleChat}
                setShowSingleChat={setShowSingleChat}
              />
            )}
          </>
        ) : (
          // For Mobile, only show one at a time
          !showSingleChat ?
          (
            
              <div className="chatscontainer">
                <h2>Chats</h2>
                {loading ? (
                  <div className="spinner"></div>
                ) : chats.length > 0 ? (
                  getUniqueChats().map((chat) => {
                    const isSenderLoggedInUser =
                      chat.sender._id === userInfo._id;
                    return (
                      <div
                        key={chat._id}
                        onClick={() => {
                          SelectedUserChat(isSenderLoggedInUser ? chat.receiver.username : chat.sender.username)
                          
                        }}
                      >
                        <UserCard
                          username={isSenderLoggedInUser ? chat.receiver.username : chat.sender.username}
                          latestMessage={chat.text}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>No Chats Available</div>
                )}
              </div>)
              :(
              <SingleChat
                friendName={friendName}
                Chathistory={Chathistory}
                setChathistory={setChathistory}
                setNewMessage={setNewMessage}
                setFriendName={setFriendName}
                loading={chatLoading}
                showSingleChat={showSingleChat}
                setShowSingleChat={setShowSingleChat}
                setSocketmessage={setSocketmessage}
                setSocketsent={setSocketsent}
              />)
            
          
        )}
      </div>
    </>
  );
};

export default Chats;
