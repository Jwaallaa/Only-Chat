import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Chats from './Components/Chats'

const router = createBrowserRouter([
  {
    path: "/Only-Chat",
    element : <Home/>
  }
  ,
  {
    path : "/Only-Chat/chats",
    element: <Chats/>
  }

] ,{
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }})

function App() {
  

  return (
    <>
      <RouterProvider router = {router}/>
    </>
  )
}

export default App
