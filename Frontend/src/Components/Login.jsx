import React, { useState } from "react";
import { Form } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = ({ setregister, setlogin }) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.post(
          'https://only-chat.onrender.com/api/user/login',
          { email, password },
          config
        );
        console.log(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate('/Chats');
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } else {
      setErrorMessage("Please enter both email and password.");
    }
  };
      


  let register = () => {
    console.log("clicked");
    setlogin(false);
    setregister(true);
  };
  const togglePasswordVisibility = () => {
    setShow(!show); // Toggle the show state
};
  return (
    <>
      <div className="login-box">
        <h2>welcome Back</h2>
        <Form action="/Chats" method="post">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username or email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <br />

          <input
            type={show ? "text" : "password"}
            id="password"
            placeholder="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button id="showbtn" type="button" onClick={togglePasswordVisibility}>
            {show ? "Hide" : "Show"}
          </button>
          <br />
          <button type="submit" onClick={handleLogin}>Login</button>
        </Form>
        <h3>
          New to OnlyChat ? <button onClick={register}>Get Started</button>
        </h3>
      </div>
    </>
  );
};

export default Login;
