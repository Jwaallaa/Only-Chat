import React from 'react'
import "./UserCard.css"
const UserCard = ({username = "user" , user_pic ="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", onClick }) => {
  return (
    <div className='usercard' onClick={onClick}>
        <div className='user_pic'>
            <img src={user_pic}/>
        </div>
        <div className='name'>{username}</div>

    </div>
  )
}

export default UserCard