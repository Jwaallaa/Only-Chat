import React, { useState, useEffect, useRef } from "react";
import "./SingleChat.css";
import Modal from "./Modal"; // Import the Modal component

const SingleChat = ({
  Chathistory,
  friendName,
  setFriendName,
  setChathistory,
  setNewMessage,
  setShowSingleChat,
  setSocketsent,
  setSocketmessage
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [friendDetails, setFriendDetails] = useState(null);
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const chatEndRef = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    // setSocketsent(false);
    console.log(setSocketsent);
    

    const url = "https://only-chat.onrender.com/api/chats/message";
    const token = userInfo.token;

    const messageData = {
      receiver: friendName,
      text: message,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
     

      const newMessage = {
        ...data,
        sender: { _id: userInfo._id },
      };

      if (response.ok) {
        setChathistory((prevChathistory) => [...prevChathistory, newMessage]);
        setMessage("");
        setLoading(false);
        setNewMessage(true);
        setSocketmessage(data)
        setSocketsent(true)

      } else {
        console.error("Error sending message:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setLoading(false);
    }
  };

  const fetchFriendDetails = async () => {
    const token = userInfo.token;
    const url = `https://only-chat.onrender.com/api/user/find/${friendName}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriendDetails(data);
      } else {
        console.error("Error fetching friend details");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Removed useEffect that automatically calls fetchFriendDetails when friendName changes

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [Chathistory]);

  return (
    <div className="singlechat">
      {friendName === "" ? (
        <h2>Select a Chat</h2>
      ) : (
        <>
          <div className="head">
            <i
              className="fa-sharp fa-solid fa-arrow-left"
              onClick={() => {setFriendName("");
                setShowSingleChat(false);}
              }
            ></i>
            <h2>{friendName}</h2>
            <i
              className="fa-solid fa-eye"
              onClick={fetchFriendDetails} // Fetch friend details only when the eye icon is clicked
            ></i>
          </div>

          <div className="chatcontainer">
            {Chathistory.length > 0 ? (
              Chathistory.map((chat, index) => {
                const isSentByUser = chat.sender._id === userInfo._id;
                const isLastMessageFromSameSender =
                  index > 0 &&
                  Chathistory[index - 1].sender._id === chat.sender._id;

                return (
                  <div
                    key={chat._id}
                    className={`message ${isSentByUser ? "sent" : "received"}`}
                  >
                    {!isLastMessageFromSameSender && (
                      <img
                        src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                        alt="User Avatar"
                        className="message-avatar"
                      />
                    )}
                    <p>{chat.text}</p>
                    <span>
                      {new Date(chat.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                );
              })
            ) : (
              <p>No messages available</p>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chatinput" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit" disabled={!message || loading}>
              {loading ? <div className="spinner-mini"></div> : "Send"}
            </button>
          </form>
        </>
      )}

      {/* Modal for Friend Details */}
      {friendDetails && (
        <Modal user={friendDetails} onClose={() => setFriendDetails(null)} />
      )}
    </div>
  );
};

export default SingleChat;
