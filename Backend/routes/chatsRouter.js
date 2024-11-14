import express from 'express';
const router = express.Router();
import Chat from '../models/chatModel.js'
import User from '../models/userModel.js'
import authenticateToken from '../middleware/authMiddleware.js'



router.get('/:selectedUser', authenticateToken, async (req, res) => {
    const loggedInUser = req.user.id; // Assuming you set req.user in your authenticateToken middleware
    const selectedUserParam = req.params.selectedUser;
    
    let selectedUser;
  
    // Check if the selectedUserParam is a valid ObjectId (i.e., user ID)
    if (mongoose.Types.ObjectId.isValid(selectedUserParam)) {
      // If it's a valid ObjectId, search by user ID
      selectedUser = await User.findById(selectedUserParam);
    } else {
      // If it's not a valid ObjectId, search by username
      selectedUser = await User.findOne({ username: selectedUserParam });
    }
  
    // If the selected user is not found, return an error response
    if (!selectedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // Fetch chats where either sender or receiver is the logged-in user and the selected user
    Chat.find({
      $or: [
        { sender: loggedInUser, receiver: selectedUser._id },
        { sender: selectedUser._id, receiver: loggedInUser }
      ]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: 1 }) // Sort by creation date (oldest first)
      .then(chats => res.json(chats))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  

router.get('/', authenticateToken ,async (req , res)=>{
    
    const userId = req.user.id; // Assuming you have user ID in req.user from authentication middleware
   
    try {
        const chats = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate("sender" , "username").
        populate("receiver" , "username") // Populate sender and receiver with their usernames

        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching chats' });
    }

})

router.post('/message', authenticateToken, async (req, res) => {
     // Log the incoming request body

    const { receiver, text } = req.body;
    const sender = req.user.id; // Assuming sender is derived from the authenticated user

    // Ensure receiver and text are provided
    if (!receiver) {
        return res.status(400).json({ message: 'Receiver is required' });
    }
    if (!text) {
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        const user = await User.findOne({ username: receiver });

        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        

        const result = await Chat.create({
            sender: sender,
            receiver: user._id,
            text: text
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating chat' });
    }
});

export default router;


