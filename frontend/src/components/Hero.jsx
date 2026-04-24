import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import { Bookmark, Play } from 'lucide-react'
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: import.meta.env.VITE_TMDB_TOKEN
  }
};

const Hero = () => {

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
      .then(res => res.json())
      .then(res => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        }
      })
      .catch(err => console.error(err));
  }, [])
  if (!movie) {
    return <p>Loading...</p>;
  }


  return (
    <div className="text-white relative h-[700px] top-18">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt="bg-img"
        className="w-full rounded-2xl h-[700px] object-cover object-center"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-2xl" />

      {/* Action Buttons */}
      <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium z-10">
        <h2 className="absolute bottom-15 left-4 md:bottom-20 md:left-10 text-xl md:text-3xl font-bold z-10 font-serif">
          {movie.title}
        </h2>

        <button className="flex justify-center items-center bg-[#e1b797] hover:bg-[#e6c4aa] text-[#5f391c] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
          <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Save for Later
        </button>
        <Link to={`/movie/${movie.id}`}>
          <button className="flex justify-center items-center bg-[#5f391c] hover:bg-[#2c1b0d] text-[#e1b797] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
            <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
          </button>
        </Link>
      </div>
    </div>

  )
}

export default Hero
