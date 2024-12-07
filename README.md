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

**Frontend:**  
- React.js  
- Axios  
- Tailwind CSS / CSS Modules (or your preferred styling library)  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Socket.IO for real-time updates  

**Deployment:**  
- Frontend: GitHub Pages  
- Backend: Render  

---

## Installation and Setup  

### Prerequisites  
- Node.js (v14+)  
- MongoDB (local or Atlas)  
- Git  

### Backend Setup  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/Jwaallaa/Only-Chat.git  
   cd Only-Chat/backend  

### Install dependencies
```bash
npm install  

### Configure environment variables
Create a .env file in the backend directory with the following:
```bash
PORT=5000  
MONGO_URI=<your_mongo_connection_string>  
JWT_SECRET=<your_jwt_secret>  
SOCKET_IO_SERVER=<your_socket_io_server_url>  

#Start the server
```bash
npm start  
