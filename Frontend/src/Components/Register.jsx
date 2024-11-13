import React, { useState  } from 'react';
import { useNavigate } from "react-router-dom";
import { Form } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = ({ setregister, setlogin }) => {
    const [show, setShow] = useState(false);
    const [name ,setName] = useState('');
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShow(!show); // Toggle the show state
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Add your form submission logic here
        console.log('Form submitted');
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        try{
          const { data } = await axios.post('https://only-chat.onrender.com/api/user/register', {
            name : name,
            username: username,
            email: email,
            password: password
            }, config);

            console.log(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setlogin(true)
            navigate('/');
        }
        catch(error){
          setError(error.message);
          }
          
    };

    const login = () => {
        console.log('clicked');
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
                        placeholder='Name' 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    /><br />
                    <input 
                        type="text" 
                        id="Username" 
                        name="Username" 
                        placeholder='Username' 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    /><br />
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder='Email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    /><br />
                    <input 
                        type={show ? "text" : "password"} 
                        id="password" 
                        placeholder='Password' 
                        name="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button id="showbtn" type="button" onClick={togglePasswordVisibility}>
                        {show ? "Hide" : "Show"}
                    </button><br />
                    <button type='submit'>Sign up</button>
                </Form>
                <h3>Already a Member <button onClick={login}>Login</button></h3>
            </div>
        </>
    );
};

export default Register;