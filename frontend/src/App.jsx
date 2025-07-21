import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Moviepage from './pages/MoviePage'
import AIRecommendations from './pages/AIRecommendations'
import { Routes,Route } from 'react-router'
import { Import } from 'lucide-react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp.JSX'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

function App() {
   const {fetchUser,fetchingUser} = useAuthStore();
  useEffect(()=>{
    fetchUser()
  },[fetchUser])
  if(fetchingUser){
    return <p> loading...</p>
  }
  
   return (
    <>
      <div>
        <Toaster></Toaster>
        <Navbar></Navbar>
        <Routes>
            <Route path={"/"} element={<Homepage />} />
            <Route path={"/movie/:id"} element={<Moviepage />} />
            <Route path={"/signin"} element={<SignIn />} />
            <Route path={"/signup"} element={<SignUp />} />
            <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
        </Routes>
        </div>

    </>
  )
}

export default App
