import React from 'react';
import "./UserCard.css";

const UserCard = ({ username = "user", user_pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", latestMessage = "", onClick }) => {
  return (
    <div className='usercard' onClick={onClick}>
        <div className='user_pic'>
            <img src={user_pic} alt="User Avatar"/>
        </div>
        <div className='name'>{username}</div>
        {latestMessage && <div className='latest-message'>{latestMessage}</div>} {/* Display the latest message */}
    </div>
  );
};

export default UserCard;
