import { useEffect, useState } from 'react'
import Homepage from './pages/Homepage'
import MoviePage from './pages/MoviePage'
import AIRecommendations from './pages/AIRecommendations'
import { Routes,Route } from 'react-router'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
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
        <Routes>
            <Route path={"/"} element={<Homepage />} />
            <Route path={"/movie/:id"} element={<MoviePage />} />
            <Route path={"/signin"} element={<SignIn />} />
            <Route path={"/signup"} element={<SignUp />} />
            <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
        </Routes>
        </div>

    </>
  )
}

export default App
