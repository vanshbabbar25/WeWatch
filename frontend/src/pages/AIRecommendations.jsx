import React, { useState,setView } from 'react';
import { getAIRecommendation } from '../lib/AIModel';
import toast from "react-hot-toast";
import Navbar from '../components/Navbar';
import { Link } from 'react-router';

const steps = [
  {
    name: "genre",
    label: "What's your favorite genre?",
    options: [
      "Action",
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Sci-Fi",
      "Animation",
    ],
  },
  {
    name: "mood",
    label: "What's your current mood?",
    options: [
      "Excited",
      "Relaxed",
      "Thoughtful",
      "Scared",
      "Inspired",
      "Romantic",
    ],
  },
  {
    name: "decade",
    label: "Preferred decade?",
    options: ["2020s", "2010s", "2000s", "1990s", "Older"],
  },
  {
    name: "language",
    label: "Preferred language?",
    options: ["English", "Hindi", "Punjabi", "French", "Korean"],
  },
  {
    name: "length",
    label: "Preferred movie length?",
    options: ["Short (<90 min)", "Standard (90-120 min)", "Long (>120 min)"],
  },
];

const initialState = steps.reduce((acc, step) => {
  acc[step.name] = "";
  return acc;
}, {});
function About() {
  return <h1>About Page</h1>;
}
const AIRecommendations = () => {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(initialState);
  const [recommendation, setRecommendation] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);


  const handleOption = (value) => {
    const currentStep = steps[step];
    const updatedInputs = {
      ...inputs,
      [currentStep.name]: value,
    };
    setInputs(updatedInputs);

    if (step === steps.length - 1) {
      setCompleted(true);
    } else {
      setStep(step + 1);
    }
  };
  const onClicked=(e)=>{
     console.log(inputs);
  }

    const generateRecommendations = async () => {
      setIsLoading(true);
      const userPrompt = `Given the following user inputs:
      - Decade: ${inputs.decade}
      - Genre: ${inputs.genre}
      - Language: ${inputs.language}
      - Length: ${inputs.length}
      - Mood: ${inputs.mood}

      Recommend 9 ${inputs.mood.toLowerCase()} ${
            inputs.language
          }-language ${inputs.genre.toLowerCase()} movies released in the ${
            inputs.decade
          } with a runtime between ${
            inputs.length
          }. Return the list as plain JSON array of movie titles only, No extra text, no explanations, no code blocks, no markdown, just the JSON array.
          example:
      [
        "Movie Title 1",
        "Movie Title 2",
        "Movie Title 3",
        "Movie Title 4",
        "Movie Title 5",
        "Movie Title 6",
        "Movie Title 7",
        "Movie Title 8",
        "Movie Title 9"
      ]`;

          const result = await getAIRecommendation(userPrompt);
          if (result) {
            const cleanedResult = result
              .replace(/```json\n/i, "")
              .replace(/\n```/i, "");
            try {
            //  const recommendationArray = JSON.parse(cleanedResult);
                const recommendationArray = [
                  "The Social Network",
                  "1917",
                  "Knives Out",
                  "Soul",
                  "Coco",
                  "Dune",
                  "La La Land",
                  "Get Out"
                ]; 
                setRecommendation(recommendationArray);
                fetchMovies(recommendationArray);

              console.log(recommendationArray);
              fetchMovies(recommendationArray);
            } catch (error) {

              toast.error("Limit exceeded for today. please try after 24hrs");
              console.log("Error:", error);
            }
            setIsLoading(false)
          } else {
            toast.error("Failed to get recommendations.");
          }
  };
const fetchMovies = async (arr) => {
  const allMovies = [];

  for (let i = 0; i < arr.length; i++) {
    const movie = await showfun(arr[i]);
    if (movie) allMovies.push(movie); // only push if movie is found
  }
  setMovieDetails(allMovies);
  console.log("wooo"+allMovies) // store all in state
  console.log(movieDetails) // store all in state
};

const showfun = async (title) => {
  const cleanedTitle = title.replace(/\(\d{4}\)/, '').trim();
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(cleanedTitle)}&include_adult=false&language=en-US&page=1`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGNjOTc0YzVmOTZkZGU3Y2RkZDcxM2FlM2ZhNDIzYiIsIm5iZiI6MTc1MjMwNDExNS4yOTUsInN1YiI6IjY4NzIwOWYzMjc1YmI0NmVlZTZlOWUwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pq2LSFZQijzrDADsoXvWEJlTY2E5Hsd6NT3k4zBXRaQ'
    }
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    if (json.results && json.results.length > 0) {
      console.log("✅ Found:", json.results[0].title);
      return json.results[0]; // ✅ Return the result here
    } else {
      console.log("❌ Not found for:", title);
      return null;
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
};


  return (
    (
      
    <div className=" min-h-screen w-full  bg-[#784923]">
      <Navbar></Navbar>
      {!recommendation ? (
        <div className='relative w-full max-w-md mx-auto rounded-2xl bg-[#5f391c] shadow-2xl border-amber-50 px-8 py-6 mt-7 flex flex-col items-center min-h-[440px]'>
         <h2 className='text-3xl font-extrabold mb-4 text-center text-white'>AI Recommendations</h2>
        <div>
                {!completed ? (
        <div className="grid grid-cols-1 gap-3 w-full">
          <h3 className="text-lg font-semibold text-white mb-1 text-center">
            {steps[step].label}
          </h3>
          {steps[step].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOption(opt)}
              className="bg-white text-amber-950 font-medium py-2 px-4 rounded hover:bg-[#e1b797] transition-all duration-200"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <>
        <div className="text-white text-center">
          <h3 className="text-2xl font-bold mb-5">Your Preferences</h3>
          <ul className="space-y-2 mb-5">
            {Object.entries(inputs).map(([key, value]) => (
              <li key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </li>
            ))}
          </ul>
          
        </div>
        <button className='mt-5  text-amber-950 font-bold py-2 px-4 rounded bg-[#e1b797] hover:bg-[#c1ab9a] transition-all duration-200 ' onClick={generateRecommendations}>get recommendations</button>
        {isLoading?(
          <div className='text-[#e1b797]'>loading....</div>
          ):
          (
          <div></div>
        )
          }
        </> 
      )}
          
        </div>
        </div>


      ) :
      ( 
        <div className="text-white bg-[#784923] h-100% text-center">
          <h3 className="text-3xl font-bold font-serif pt-5">According to Your Mood</h3>
          <ul className="space-y-2 ">
           <div className="flex flex-wrap justify-center">




            {movieDetails.map((movie, index) => (
              <Link to={`/movie/${movie.id}`}>
              <div
                className="bg-amber-950 w-72 m-4 rounded-lg shadow-md hover:opacity-80 overflow-hidden hover:scale-105 transition flex flex-row gap-3 p-2"
                key={index} onMouseEnter={() => setHoveredCard(index)}onMouseLeave={() => setHoveredCard(null)}
              >
                <img
                  className="h-28 w-20 object-cover rounded"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}  
                />{hoveredCard === index ?
                <div className="flex flex-col justify-between">
                  <h4 className="text-lg my-1 mx-2 font-serif from-neutral-400">{movie.title}</h4>
                  <h4 className="text-xs my-1 font-serif from-neutral-400">{movie.overview.slice(0, 115)} ....</h4>
                </div>:
                  <div className="flex flex-col justify-between">
                  <h4 className="text-lg font-semibold my-4 mx-4 font-serif from-neutral-400">{movie.title}</h4>
                  <p className="text-sm text-white">{movie.release_date}</p>
                </div>
                }
              </div>
              </Link>
            ))}
          </div>

          </ul>



        </div>
        
        
      )}

    </div>
    )
  );
  
};

export default AIRecommendations;
