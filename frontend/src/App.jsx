import { useEffect } from 'react'
import Homepage from './pages/Homepage'
import MoviePage from './pages/MoviePage'
import AIRecommendations from './pages/AIRecommendations'
import { Routes, Route } from 'react-router'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Player from './pages/Player'
import RecommendationsPage from "./pages/Recommendation";
import WatchLaterPage from './pages/WatchLaterPage'
import HistoryPage from './pages/HistoryPage'

import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

function App() {
  const { fetchUser, fetchingUser } = useAuthStore();
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  if (fetchingUser) {
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
          <Route path={"/player"} element={<Player src="https://www.youtube.com/watch?v=N7Q_56f39MQ" />} />
          <Route path={"/recommendations"} element={<RecommendationsPage />} />
    

          <Route path={"/history"} element={<HistoryPage />} />
          <Route path={"/watch-later"} element={<WatchLaterPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
