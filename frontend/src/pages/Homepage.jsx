import React from 'react'
import Hero from '../components/Hero.jsx'
import CardList from '../components/CardList.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar'

const Homepage = () => {
  return (
    <div className=' bg-[#392211]'>
      <Navbar></Navbar>
      <Hero></Hero>
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
  )
}

export default Homepage
