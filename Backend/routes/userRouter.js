import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import { passcrypt, checkpass } from '../Utils/BcryptPassword.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import generateToken from '../Utils/JwtToken.js';

// Get all users except the requesting user
router.get("/", (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token is missing' });

  jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    const { id } = req.user;
    try {
      const users = await User.find({ _id: { $ne: id } });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

// Register a new user
router.post("/register", (req, res) => {
  const { name, email, password, username, pic } = req.body;
  User.create({
    name,
    email,
    password: passcrypt(password),
    username,
    pic,
  })
    .then((user) => {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
        pic: user.pic,
        token: generateToken(user._id),
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

// Login user with either email or username
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email + password);

  // Find user by either email or username
  User.findOne({
    $or: [{ email: email }, { username: email }],
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid email/username or password" });
      }
      if (!checkpass(password, user.password)) {
        return res.status(401).json({ message: "Invalid email/username or password" });
      }

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
        pic: user.pic,
        token: generateToken(user._id),
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Get users by partial username match
router.get('/:username', async (req, res) => {
  try {
    const name = req.params.username;
    const users = await User.find({
      name: { $regex: name, $options: 'i' },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by exact username with authentication
router.get('/find/:username', authMiddleware, async (req, res) => {
  const username = req.params.username;
  try {
    const userinfo = await User.findOne({ username: username });
    res.status(200).json(userinfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
