import React from 'react'
import './Home.css'
import Login from './Login'
import Register from './Register'
import { useState ,useEffect } from 'react'
import { useNavigate } from "react-router-dom";




const Home = () => {
    const navigate = useNavigate();
    const checkUserInfo = () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
          return true; // User info exists
        } else {
          return false; // User info does not exist
        }
      };


    const [login, setlogin] = useState(false)
    const [register, setregister] = useState(false)
    let tologin = ()=>{
        console.log("login clicked")
        setregister(false)
        setlogin(true)
        
    }

    let toregister = ()=>{
        console.log("register clicked")
        setlogin(false)
        setregister(true)
        
    }
    useEffect(() => {
        if(checkUserInfo()){
            navigate("/Only-Chat/chats");
        }
      
    }, [])
    
    
    
  return (
    <>
    <div className="main">
    <h1>ONLY CHAT</h1>
        <div className='innermain'>
        <div className="imgCont">

        
        {login ?  <Login setregister={setregister}  setlogin={setlogin}/>
        : register ? <Register setregister={setregister}  setlogin={setlogin}/> :

        <div className="textCont">
            
            <p>Only chat is a platform where you can connect with people from all over the world</p>
            <div>
                <button onClick={toregister} className="Register">Get Started</button>
            </div>
        <div >Already a User? <button to='/Login' className='Login' onClick={tologin}>Login</button></div>
        </div>}
        
        </div>
        </div>
    </div>
    </>
  )
}

export default Home

















