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
  const [chatLoading, setChatLoading] = useState(false); // New loading state for chat history

  // Fetch chats
  const fetchChats = async () => {
    if (!userInfo || !userInfo.token) {
      return;
    }

    const cachedChats = localStorage.getItem("chats");
    if (cachedChats) {
      setChats(JSON.parse(cachedChats));
      setLoading(false);
      return;
    }

    const token = userInfo.token;

    try {
      const response = await fetch("https://only-chat.onrender.com/api/chats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setChats(data);
      setLoading(false);
      localStorage.setItem("chats", JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Fetch chat history for a specific user
  const SelectedUserChat = async (userId) => {
    setChatLoading(true); // Start loading the chat history spinner
    const token = userInfo.token;

    try {
      const response = await fetch(
        `https://only-chat.onrender.com/api/chats/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setChathistory(data);
      setFriendName(userId);
      setChatLoading(false); // Stop loading once the data is fetched
    } catch (error) {
      console.error("Error fetching chats with selected user:", error);
      setChatLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/Only-Chat");
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
                  onClick={() => SelectedUserChat(suser.username)}
                />
              </div>
            ))
          ) : (
            <h3>No results found</h3>
          )}
        </div>
      </div>

      <div className="chatpage">
        <div className="chatscontainer">
          <h2>Chats</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : chats.length > 0 ? (
            [
              ...new Map(
                chats.map((chat) => [
                  chat.sender && chat.sender._id === userInfo._id
                    ? chat.receiver._id
                    : chat.sender._id,
                  chat,
                ])
              ).values(),
            ].map((chat) => {
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
                  <UserCard username={displayUsername} />
                </div>
              );
            })
          ) : (
            <h3>No chats available</h3>
          )}
        </div>

        {chatLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div> {/* Spinner centered in the div */}
          </div>
        ) : (
          <SingleChat
            friendName={friendName}
            Chathistory={Chathistory}
            setFriendName={setFriendName}
            setChathistory={setChathistory}
          />
        )}
      </div>
    </>
  );
};

export default Chats;
