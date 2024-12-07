# Only-Chat  

**Only-Chat** is a real-time chat application designed to provide seamless messaging between users. The app includes user authentication, chat history management, and mobile-friendly UI components. It is powered by a MERN (MongoDB, Express, React, Node.js) stack with real-time messaging supported by Socket.IO.  

---

## Features  

- **Real-Time Messaging:** Instant communication with real-time updates via Socket.IO.  
- **User Authentication:** Secure login and signup functionality.  
- **Chat History:** Persistent chat history stored in a MongoDB database.  
- **Responsive Design:** Mobile-friendly UI for optimal usability on all devices.  
- **Search Functionality:** Easily find and start chats with users.  
- **Mobile Navbar:** A clean, icon-based navigation for smaller screens.  

---

## Tech Stack  

### Frontend  
- React.js  
- Axios  
- Tailwind CSS (or other preferred styling library)  

### Backend  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Socket.IO  

### Deployment  
- **Frontend:** GitHub Pages  
- **Backend:** Render  

---

## Installation and Setup  

### Prerequisites  

- Node.js (v14 or higher)  
- MongoDB (local or Atlas)  
- Git  

### Backend Setup  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/Jwaallaa/Only-Chat.git  
   cd Only-Chat/backend
   ```
Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
***Create a .env file in the backend directory with the following content:***
   ```bash
   env
   Copy code
   PORT=5000  
   MONGO_URI=<your_mongo_connection_string>  
   JWT_SECRET=<your_jwt_secret>  
   SOCKET_IO_SERVER=<your_socket_io_server_url> ```
Start the server:
   ```bash
   npm start  ```

###Frontend Setup
***Navigate to the frontend directory:***
   ```bash
   cd ../frontend ```
***Install dependencies:***
   ```bash
   npm install  ```

Update API endpoint:
Update the backend API URL in the frontend/src/config.js file:
   ```bash
   export const API_URL = "https://your-backend-url.onrender.com";  
Start the development server:
   ```bash
   npm start  
##Deployment
Frontend
Build the app:
   ```bash
   npm run build  
 
##Backend Setup
Deploy the backend on Render or any other cloud platform. Ensure the deployed URL is updated in the frontend configuration.
###Database Schema
Users Collection
   ```bash
  | _id|	ObjectId|	Unique identifier|
  |----| --------| -------------------|
  |name |	String	|Full name of the user|
  |email |	String	|User's email address|
  |password	| String	|Encrypted user password|
  |username |	String|	Unique username|
  |createdAt |	Date	|Timestamp of creation|
  |updatedAt |	Date	|Timestamp of last update|```
Chats Collection
   ```bash
   _id	ObjectId	Unique identifier
   sender	ObjectId	User who sent the message
   receiver	ObjectId	User who received the message
   text	String	Message text
   createdAt	Date	Timestamp of creation
   updatedAt	Date	Timestamp of last update

###Future Improvements
- Group chat functionality
- Enhanced user profile features
- Push notifications for new messages
- Advanced search with filters
##License
This project is licensed under the MIT License. See the LICENSE file for details.

##Contributing
Contributions are welcome! Feel free to fork this repository, open issues, or submit pull requests.

##Contact
Udit Jaiswal

- [LinkedIn](https://www.linkedin.com/in/udit--jaiswal/)
- [GitHub](https://github.com/Jwaallaa/)


Copy this into your `README.md` file, and it should render perfectly on GitHub or other Mark
