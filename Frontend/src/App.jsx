import { createHashRouter, RouterProvider } from 'react-router-dom'; // Use createHashRouter for hash-based routing
import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Chats from './Components/Chats';

const router = createHashRouter([
  {
    path: "/", // Updated path
    element: <Home /> 
  },
  {
    path: "/chats", // Updated path
    element: <Chats />
  }
], {
  future: { v7_startTransition: true }, // Enable the future flag
});

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
