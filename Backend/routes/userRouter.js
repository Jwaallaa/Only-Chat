import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import {passcrypt , checkpass } from '../Utils/BcryptPassword.js'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/authMiddleware.js'
import generateToken from '../Utils/JwtToken.js'


router.get("/" ,(req , res)=>{
  const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token after 'Bearer'

    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        User.findOne()
        req.user = user; // Attach user data to request
        const {id} = req.user
        const users = await User.find({ _id: { $ne:id } }) // Find all users except the requesting user
    .then((users) => {
      res.status(200).json(users)
      
    })
  })
})

router.post("/register", (req, res) => {
  let { name, email, password, username,pic} = req.body;
  User.create({
    name,
    email,
    password : passcrypt(password),
    username,
    pic,
  })
    .then((user) => {
      res.json({
        _id: user._id,
      name: user.name,
      email: user.email,
      password : user.password,
      username: user.username,
      pic:user.pic,
      token: generateToken(user._id)});
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

router.post("/login", (req, res) => {
  let { email, password } = req.body;
  console.log(email + password)
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    else if(!checkpass(password , user.password)){
        return res.status(401).json({ message: "Invalid email or password" });
    }
    else{
        return res.status(200).json(
            {
                _id: user._id,
              name: user.name,
              email: user.email,
              password : user.password,
              username: user.username,
              pic: user.pic,
              token: generateToken(user._id)
            }
        )}
  });
});

router.get('/:username', async (req, res) => {
  try {
    const name = req.params.username; // Use 'username' to match the route parameter
    const users = await User.find({
      name: { $regex: name, $options: 'i' } // Use 'username' for the query
    });
    res.status(200).json(users); // Send a response with a 200 status
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors properly
  }
});

router.get('/find/:username', authMiddleware , async(req  ,res)=>{
  const username = req.params.username;
  try{
  const userinfo = await User.findOne({username:username})
  res.status(200).json(userinfo);
  }
  catch(err){
    res.status(500).json({message:err.message})
  }

})

export default router;
