import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Login from './Components/Login'
import SingleChat from './Components/SingleChat'
import Chats from './Components/Chats'

const router = createBrowserRouter([
  {
    path: "/",
    element : <Home/>
  }
  ,
  {
    path: "/login",
    element : <Login/>
  }
  ,
  {
    path : "/Chats",
    element: <Chats/>
  }
  ,{
    path : "/Chats/:name",
    element : <SingleChat/>
  }

] ,{
  future: { v7_startTransition: true }, // Enable the future flag
})

function App() {
  

  return (
    <>
      <RouterProvider router = {router}/>
    </>
  )
}

export default App
