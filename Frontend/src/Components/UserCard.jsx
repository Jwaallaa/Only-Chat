import React from 'react';
import "./UserCard.css";

const UserCard = ({ username = "user", user_pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", latestMessage = "", onClick ,unreadCount}) => {
  return (
    <div className={`usercard ${unreadCount > 0 ? "unread" : ""}`} onClick={onClick}>
        <div className='user_pic'>
            <img src={user_pic} alt="User Avatar"/>
        </div>
        <div className='name'>{username}</div>
        {latestMessage && <div className='latest-message'>{latestMessage}</div>} {/* Display the latest message */}
        {unreadCount>0 ? <span>+{unreadCount}</span>: null}
    </div>
  );
};

export default UserCard;
