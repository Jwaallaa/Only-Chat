import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserCard from "./UserCard";
import "./Chats.css";
import SingleChat from "./SingleChat";

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
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchChats();
  }, [newMessage]);

  const handleLoginRedirect = () => {
    navigate("/Only-Chat");
  };

  // Function to get the latest message for a user
  // Function to get the latest message for a user
  const getLatestMessage = (username) => {
    console.log(chats);

    const userChats = chats.filter(
      (chat) =>
        chat.sender.username === username || chat.receiver.username === username
    );
    

    // If there are messages, sort by creation date and get the most recent
    if (userChats.length > 0) {
      userChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort descending by date
      return userChats[0].text; // Return the most recent message text
    }
    return "No messages yet"; // Default text if no messages
  };

  const getUniqueChats = () => {
    const chatMap = new Map();
  
    // Iterate over each chat to store the latest chat for each unique user pair
    chats.forEach((chat) => {
      // Create a unique key for the user pair by sorting their IDs lexicographically
      const userPairKey =
        chat.sender._id < chat.receiver._id
          ? `${chat.sender._id}-${chat.receiver._id}`
          : `${chat.receiver._id}-${chat.sender._id}`;
  
      // If this pair already exists in the map, keep only the latest chat message
      if (
        chatMap.has(userPairKey) &&
        new Date(chatMap.get(userPairKey).createdAt) > new Date(chat.createdAt)
      ) {
        return; // Skip this chat if it's older
      }
  
      // Set the latest chat for this user pair in the map
      chatMap.set(userPairKey, chat);
    });
  
    // Convert the map values to an array and sort by createdAt in descending order
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
                  latestMessage={getLatestMessage(suser.username)} // Pass the latest message
                  onClick={() => {
                    SelectedUserChat(suser.username);
                    setSearch(false);
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
        {!isMobile || !showSingleChat ? (
          <div className="chatscontainer">
            <h2>Chats</h2>
            {loading ? (
              <div className="spinner"></div>
            ) : chats.length > 0 ? (
              getUniqueChats().map((chat) => {
                const isSenderLoggedInUser =
                  chat.sender && chat.sender._id === userInfo._id;
                const displayUsername = isSenderLoggedInUser
                  ? chat.receiver.username
                  : chat.sender
                  ? chat.sender.username
                  : "Unknown User";

                return (
                  <div
                    key={chat._id}
                    onClick={() => SelectedUserChat(displayUsername)}
                  >
                    <UserCard
                      username={displayUsername}
                      latestMessage={getLatestMessage(displayUsername)} // Pass the latest message
                    />
                  </div>
                );
              })
            ) : (
              <h3>No chats available</h3>
            )}
          </div>
        ) : null}

        {(!isMobile || showSingleChat) && (
          <SingleChat
            friendName={friendName}
            Chathistory={Chathistory}
            setNewMessage={setNewMessage}
            setFriendName={(name) => {
              setFriendName(name);
              setShowSingleChat(false); // Return to chat list on mobile when closing chat
            }}
            setChathistory={setChathistory}
          />
        )}
      </div>
    </>
  );
};

export default Chats;
