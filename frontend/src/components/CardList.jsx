import React, { useState,useEffect } from 'react'
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // optional
import SwiperCore from "swiper";
SwiperCore.use([]); // add Navigation or Autoplay if needed

const CardList = ({ title, category }) => {
  const [data, setData] = useState([]);

  const genreMap = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  Romance: 10749,
};


  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGNjOTc0YzVmOTZkZGU3Y2RkZDcxM2FlM2ZhNDIzYiIsIm5iZiI6MTc1MjMwNDExNS4yOTUsInN1YiI6IjY4NzIwOWYzMjc1YmI0NmVlZTZlOWUwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pq2LSFZQijzrDADsoXvWEJlTY2E5Hsd6NT3k4zBXRaQ',
    },
  };

  useEffect(() => {
    const genreId = genreMap[category];

    let url = "";

    if (genreId) {
      // It's a genre (e.g., Comedy, Action)
      url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`;
    } else {
      // It's a valid category like 'popular' or 'top_rated'
      url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`;
    }

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => setData(res.results || []))
      .catch((err) => console.error(err));
  }, [category]);

  return (
    <>
    <div className="text-[#e1b797] text-xl ">
      <h2 className="pt-10 pb-5 px-5 text-2xl font-medium">{title}</h2>
      <div className="px-5 ">
<Swiper
  slidesPerView={"auto"}
  spaceBetween={14}
  className="mySwiper px-7"
>
  {data.map((item, index) => (
    <SwiperSlide key={index} className="max-w-60">
      <Link to={`/movie/${item.id}`}>
        <div className="hover:opacity-80 transition duration-300 rounded-2xl overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
            alt={item.original_title}
            className="h-40 w-full object-cover rounded-2xl transform hover:scale-105 transition duration-300"
          />
        </div>
        <p className="text-center pt-2 text-sm text-white truncate">
          {item.original_title}
        </p>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>

      </div>

      
    </div>
    </>
  )
}

export default CardList
