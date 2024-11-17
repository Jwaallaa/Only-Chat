import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserCard from "./UserCard";
import "./Chats.css";
import SingleChat from "./SingleChat";

// Utility Functions
const getUniqueChats = (chats) => {
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

  return Array.from(chatMap.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

const getLatestMessage = (chats, username, userInfo) => {
  const userChats = chats.filter(
    (chat) =>
      (chat.sender.username === username ||
        chat.receiver.username === username) &&
      (chat.sender._id === userInfo._id || chat.receiver._id === userInfo._id)
  );

  if (userChats.length > 0) {
    userChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return userChats[0].text;
  }
  return "No messages yet";
};

const Chats = () => {
  const [searchbox, setsearchbox] = useState("");
  const [chats, setChats] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [Chathistory, setChathistory] = useState([]);
  const [usersearch, setUsersearch] = useState([]);
  const [loading, setLoading] = useState({ chatsLoading: true, searchLoading: false });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSingleChat, setShowSingleChat] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Fetch chats
  useEffect(() => {
    let isMounted = true;
    const fetchChats = async () => {
      if (!userInfo.token) return;

      try {
        const response = await fetch("https://only-chat.onrender.com/api/chats", {
          method: "GET",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch chats.");

        const data = await response.json();
        if (isMounted) {
          setChats(data);
          setLoading((prev) => ({ ...prev, chatsLoading: false }));
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        if (isMounted) setLoading((prev) => ({ ...prev, chatsLoading: false }));
      }
    };

    fetchChats();
    return () => {
      isMounted = false;
    };
  }, [newMessage, userInfo.token]);

  // Fetch chat history for a selected user
  const SelectedUserChat = async (username) => {
    setLoading((prev) => ({ ...prev, searchLoading: true }));

    try {
      const response = await fetch(
        `https://only-chat.onrender.com/api/chats/${username}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch chat history.");

      const data = await response.json();
      setChathistory(data);
      setFriendName(username);
      setShowSingleChat(isMobile); // Show single chat view on mobile
      setLoading((prev) => ({ ...prev, searchLoading: false }));
    } catch (error) {
      console.error("Error fetching chats with selected user:", error);
      setLoading((prev) => ({ ...prev, searchLoading: false }));
    }
  };

  // Handle resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to login page if not logged in
  const handleLoginRedirect = () => navigate("/Only-Chat");

  return !userInfo.token ? (
    <div className="noLogin">
      <h2>First, log in to see your chats.</h2>
      <button onClick={handleLoginRedirect}>Go to Login Page</button>
    </div>
  ) : (
    <>
      <Navbar
        setUsersearch={setUsersearch}
        setSearch={setShowSingleChat}
        setLoading={(isLoading) =>
          setLoading((prev) => ({ ...prev, searchLoading: isLoading }))
        }
        searchbox={searchbox}
        setsearchbox={setsearchbox}
      />

      <div className="chatpage">
        {!isMobile || !showSingleChat ? (
          <div className="chatscontainer">
            <h2>Chats</h2>
            {loading.chatsLoading ? (
              <div className="spinner"></div>
            ) : chats.length > 0 ? (
              getUniqueChats(chats).map((chat) => {
                const isSender = chat.sender._id === userInfo._id;
                const displayUsername = isSender
                  ? chat.receiver.username
                  : chat.sender.username;

                return (
                  <div
                    key={chat._id}
                    onClick={() => SelectedUserChat(displayUsername)}
                  >
                    <UserCard
                      username={displayUsername}
                      latestMessage={getLatestMessage(chats, displayUsername, userInfo)}
                    />
                  </div>
                );
              })
            ) : (
              <h3>No chats available</h3>
            )}
          </div>
        ) : null}

        {isMobile && showSingleChat && (
          <SingleChat
            friendName={friendName}
            Chathistory={Chathistory}
            setNewMessage={setNewMessage}
            setFriendName={(name) => {
              setFriendName(name);
              setShowSingleChat(false);
            }}
            setChathistory={setChathistory}
          />
        )}
      </div>
    </>
  );
};

export default Chats;
