import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserCard from "./UserCard";
import "./Chats.css";
import SingleChat from "./SingleChat";
import io from "socket.io-client";
import { useRef } from "react";



const port = "https://only-chat.onrender.com" //http://localhost:3000

// Setup Socket.IO connection to the server

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
  const [chatlist, setChatlist] = useState([])
  
  //socket io setup
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(port);
      socketRef.current.emit("setup", userInfo);
    }
  
    // return () => {
    //   socketRef.current?.disconnect();
    //   socketRef.current = null;
    // };
  }, [userInfo]); 



  // Fetch chats
  const fetchChats = async () => {
    if (!userInfo || !userInfo.token) return;

    const token = userInfo.token;

    try {
      const response = await fetch(`${port}/api/chats`, {
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
        `${port}/api/chats/${username}`,
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


    } catch (error) {
      console.error("Error fetching chats with selected user:", error);
      setChatLoading(false);
    }
  };

  // Handle resizing to update mobile view detection
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle incoming messages via Socket.IO
// Handle incoming messages via Socket.IO
useEffect(() => {
  const handleMessage = (message) => {
    const updatedChat = {
      _id: message.chatId,
      sender: message.sender._id,
      receiver: message.receiver._id,
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    setChathistory((prevChathistory) => [...prevChathistory, updatedChat]);

    if (!showSingleChat) {
      setChatlist((chatlist) => {
        let updatedChat;
        const updatedChatlist = chatlist.filter((chat) => {
          const isMatch =
            (chat.sender._id === message.sender._id && chat.receiver._id === message.receiver._id) ||
            (chat.sender._id === message.receiver._id && chat.receiver._id === message.sender._id);
          
          if (isMatch) {
            updatedChat = { ...chat, text: message.text, createdAt: message.createdAt };
            return false; // Remove the updated chat from the array
          }
          return true; // Keep the other chats
        });
    
        // Prepend the updated chat at the top if found
        return updatedChat ? [updatedChat, ...updatedChatlist] : updatedChatlist;
      });
    }
    
    };

  socketRef.current?.on("receiveMessage", handleMessage);

  return () => {
    socketRef.current?.off("receiveMessage", handleMessage);
  };
}, [showSingleChat]);



  // Include 'chats' so that the chat updates are reflected


  // Emit message to Socket.IO server

  

  // Send the message to the receiver's socket

  useEffect(() => {
    fetchChats();
    getUniqueChats();
  }, [newMessage]);
  useEffect(() => {
    getUniqueChats();
  }, [chats]);
  

  const handleLoginRedirect = () => {
    navigate("/Only-Chat");
  };

  const getLatestMessage = (username) => {
    const userChats = chats.filter(
      (chat) =>
        (chat.sender.username === username ||
          chat.receiver.username === username) &&
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
    console.log(uniqueChats)
    setChatlist(uniqueChats);
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
        {!isMobile ? (
          <>
            <div className="chatscontainer">
              <h2>Chats</h2>
              {loading ? (
                <div className="spinner"></div>
              ) : chats.length > 0 ? (
                chatlist.map((chat) => {
                  const isSenderLoggedInUser = chat.sender._id === userInfo._id;
                  return (
                    <div
                      key={chat._id}
                      onClick={() =>
                        SelectedUserChat(
                          isSenderLoggedInUser
                            ? chat.receiver.username
                            : chat.sender.username
                        )
                      }
                    >
                      <UserCard
                        username={
                          isSenderLoggedInUser
                            ? chat.receiver.username
                            : chat.sender.username
                        }
                        latestMessage={chat.text}
                      />
                    </div>
                  );
                })
              ) : (
                <div>No Chats Available</div>
              )}
            </div>

            <SingleChat
              friendName={friendName}
              Chathistory={Chathistory}
              setChathistory={setChathistory}
              setNewMessage={setNewMessage}
              setFriendName={setFriendName}
              loading={chatLoading}
              showSingleChat={showSingleChat}
              setShowSingleChat={setShowSingleChat}
              socketRef={socketRef}
            />
          </>
        ) : // For Mobile, only show one at a time
        !showSingleChat ? (
          <div className="chatscontainer">
            <h2>Chats</h2>
            {loading ? (
              <div className="spinner"></div>
            ) : chats.length > 0 ? (
              chatlist.map((chat) => {
                const isSenderLoggedInUser = chat.sender._id === userInfo._id;
                return (
                  <div
                    key={chat.chatId}
                    onClick={() => {
                      SelectedUserChat(
                        isSenderLoggedInUser
                          ? chat.receiver.username
                          : chat.sender.username
                      );
                    }}
                  >
                    <UserCard
                      username={
                        isSenderLoggedInUser
                          ? chat.receiver.username
                          : chat.sender.username
                      }
                      latestMessage={chat.text}
                    />
                  </div>
                );
              })
            ) : (
              <div>No Chats Available</div>
            )}
          </div>
        ) : (
          <SingleChat
            friendName={friendName}
            Chathistory={Chathistory}
            setChathistory={setChathistory}
            setNewMessage={setNewMessage}
            setFriendName={setFriendName}
            loading={chatLoading}
            showSingleChat={showSingleChat}
            setShowSingleChat={setShowSingleChat}
            socketRef={socketRef}
          />
        )}
      </div>
    </>
  );
};

export default Chats;
