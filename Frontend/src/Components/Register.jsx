import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = ({ setregister, setlogin }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const port = "https://only-chat.onrender.com" //http://localhost:3000

  const togglePasswordVisibility = () => {
    setShow(!show); // Toggle the show state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${port}/api/user/register`,
        {
          name: name,
          username: username,
          email: email,
          password: password,
        },
        config
      );

      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false); // Stop loading
      setlogin(true); // Switch to login view
      navigate("/Only-Chat");
    } catch (error) {
      setLoading(false); // Stop loading
      setError("Registration failed. Please try again."); // Set error message
    }
  };

  const login = () => {
    setregister(false);
    setlogin(true);
  };

  return (
    <>
      <div className="register-box">
        <h2>Get Started</h2>
        <Form onSubmit={handleSubmit}>
          <input
            type="text"
            id="Name"
            name="Name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <input
            type="text"
            id="Username"
            name="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <div className="password-container">
          <input
            type={show ? "text" : "password"}
            id="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa-eye ${show ? "fa-regular" : "fa-solid"}`}
            id="showbtn"
            type="button"
            onClick={togglePasswordVisibility}
          ></i></div>
          <br />
          <button type="submit" disabled={loading} className="signup-button">
            {loading ? <div className="spinner-mini"></div> : "Sign up"}
          </button>
        </Form>
        {error && <p className="error-message">{error}</p>}
        <h3>
          Already a Member? <button onClick={login}>Login</button>
        </h3>
      </div>
    </>
  );
};

export default Register;
