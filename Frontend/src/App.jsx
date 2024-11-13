import { createHashRouter, RouterProvider } from 'react-router-dom'; // Use createHashRouter for hash-based routing
import './App.css';
import Home from './Components/Home';
import Chats from './Components/Chats';

const router = createHashRouter([
  {
    path: "/Only-Chat",
    element: <Home />
  },
  {
    path: "/Only-Chat/chats",
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
