import React from 'react'
import Hero from '../components/Hero.jsx'
import CardList from '../components/CardList.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar'
import { fetchRecommendations, fetchWatchHistory } from "../api/recommendationApi";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

const Homepage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const res = await fetchRecommendations();
        setRecommendations(res.data.recommendations);
        const histRes = await fetchWatchHistory();
        setHistory(histRes.data.history);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [user]);

  let recommendTitle = "Recommended For You";
  if (history && history.length > 0) {
    recommendTitle = "Because U Watched " + history.map(m => m.title).join(", ");
  }

  return (
    <div className=' bg-[#392211]'>
      <Navbar></Navbar>
      <Hero></Hero>
      <div className="pt-[50px]">
        {user && <CardList title={recommendTitle} movies={recommendations} />}
        <CardList title="Trending" category="upcoming" />
        <CardList title="Top Rated" category="top_rated" />
        <CardList title="Popular" category="popular" />
        <CardList title="Comedy " category="Comedy" />
        <CardList title="Action " category="Action" />
        <CardList title="Horror " category="Horror" />
        <CardList title="Drama " category="Drama" />
        <CardList title="Romance " category="Romance" />
        <CardList title="Upcoming" category="upcoming" />
        <Footer></Footer>
      </div>
    </div>
  )
}

export default Homepage

