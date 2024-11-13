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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      setErrorMessage(""); // Clear any previous error message
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.post(
          "https://only-chat.onrender.com/api/user/login",
          { email, password },
          config
        );
        console.log(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/Only-Chat/Chats");
      } catch (error) {
        console.error("Login error:", error);
        setLoading(false);
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } else {
      setErrorMessage("Please enter both email and password.");
    }
  };

  const register = () => {
    setlogin(false);
    setregister(true);
  };

  const togglePasswordVisibility = () => {
    setShow(!show); // Toggle the show state
  };

  return (
    <div className="login-box">
      <h2>Welcome Back</h2>
      <Form onSubmit={handleLogin}>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username or email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <div className="password-container">
          <input
            type={show ? "text" : "password"}
            id="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa ${show ? "fa-eye-slash" : "fa-eye"}`}
            id="showbtn"
            type="button"
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner-mini"></div> : "Login"}
        </button>
      </Form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h3>
        New to OnlyChat? <button onClick={register}>Get Started</button>
      </h3>
    </div>
  );
};

export default Login;
