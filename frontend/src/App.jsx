import { useState } from 'react'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import { Routes,Route } from 'react-router'
import { Import } from 'lucide-react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp.JSX'

function App() {

  return (
    <>
      <div>
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
