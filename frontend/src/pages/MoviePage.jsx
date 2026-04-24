import { Play, Check, Plus, Bookmark } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecommendation } from "../context/RecommendationContext";
import { addToWatchLater, getWatchLater, removeFromWatchLater } from "../api/watchLaterApi";
import Navbar from "../components/Navbar";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: import.meta.env.VITE_TMDB_TOKEN
  },
};

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  // ── Recommendation context ──────────────────────────────
  const { markAsWatched, watchHistory } = useRecommendation();
  const [marking, setMarking] = useState(false);

  // ── Watch Later state ───────────────────────────────────
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [markingWatchLater, setMarkingWatchLater] = useState(false);

  // Check if this movie is already in the last-3 history
  const isWatched = watchHistory.some(
    (m) => m.tmdbId === Number(id) || m.tmdbId === id
  );

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => setMovie(res))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setRecommendations(res.results || []))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        const trailer = res.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch((err) => console.error(err));

    // Fetch watch later list to check if current movie is in it
    getWatchLater()
      .then((res) => {
        const list = res.data.list || [];
        const inWatchLater = list.some(
          (item) => String(item.movieId) === String(id)
        );
        setIsWatchLater(inWatchLater);
      })
      .catch((err) => console.error("Error fetching watch later:", err));
  }, [id]);

  // ── Watch Now handler ────────────────────────────────────
  const handleWatchNow = async () => {
    if (!movie || isWatched || marking) return;

    setMarking(true);
    await markAsWatched({
      id: movie.id,
      title: movie.title,
      // movie.genres is [{ id, name }] — extract just the ids for the engine
      genre_ids: movie.genres?.map((g) => g.id) || [],
      overview: movie.overview || "",
      vote_average: movie.vote_average || 0,
      poster_path: movie.poster_path || "",
      release_date: movie.release_date || "",
    });
    setMarking(false);
  };

  // ── Watch Later handler ───────────────────────────────────
  const handleWatchLater = async () => {
    if (!movie || markingWatchLater) return;

    setMarkingWatchLater(true);
    try {
      if (isWatchLater) {
        await removeFromWatchLater(movie.id);
        setIsWatchLater(false);
      } else {
        await addToWatchLater({
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        });
        setIsWatchLater(true);
      }
    } catch (err) {
      console.error("Watch Later error:", err);
    } finally {
      setMarkingWatchLater(false);
    }
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-[#e1b797]">Loading...</span>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#181818] text-white">
      <Navbar />
      <div
        className="relative h-[90vh] pt-[70px] flex item-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>

        <div className="relative bg-black/55 w-full z-10 flex items-end p-8 gap-8">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            className="rounded-lg shadow-lg w-48 hidden md:block"
          />

          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="max-w-2xl text-gray-200">
              {movie.overview.slice(0, 500)} .....
            </p>

            {/* ── Watch Now button ─────────────────────────────── */}
            <div className="flex items-center gap-3 mt-2 md:mt-4">
              <Link
                to={trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : "#"}
                target="_blank"
                onClick={handleWatchNow}
              >
                <button
                  // disabled={marking || isWatched}
                  className={`flex justify-center items-center py-3 px-4 rounded-full cursor-pointer text-sm md:text-base transition-all duration-200
                    ${isWatched
                      ? "bg-green-700 cursor-default opacity-80"
                      : marking
                        ? "bg-[#784923] opacity-60 cursor-wait"
                        : "bg-[#784923] hover:bg-[#9a5e2f]"
                    } text-white`}
                >
                  {isWatched ? (
                    <>
                      <Check className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                      ReWatch
                    </>
                  ) : marking ? (
                    <>
                      <Play className="mr-2 w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                      Watch Now
                    </>
                  )}
                </button>
              </Link>
              <button
                onClick={handleWatchLater}
                className={`flex justify-center items-center py-3 px-4 rounded-full cursor-pointer text-sm md:text-base transition-all duration-200
                  ${isWatchLater
                    ? "bg-green-700 hover:bg-green-800 opacity-90"
                    : markingWatchLater
                      ? "bg-yellow-600 opacity-60 cursor-wait"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  } text-white`}
              >
                {isWatchLater ? (
                  <>
                    <Check className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                    Saved to Watch Later
                  </>
                ) : markingWatchLater ? (
                  <>
                    <Bookmark className="mr-2 w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                    Watch Later
                  </>
                )}
              </button>

              {/* Subtle confirmation toast — fades in when just marked */}
              {isWatched && (
                <span className="text-xs text-green-400 animate-pulse">
                  Added to your watch history
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Details section (unchanged) ───────────────────── */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="bg-[#232323] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li>
                <span className="font-semibold text-white">Status: </span>
                <span className="ml-2">{movie.status}</span>
              </li>
              <li>
                <span className="font-semibold text-white">Release Date: </span>
                <span className="ml-2">{movie.release_date}</span>
              </li>
              <li>
                <span className="font-semibold text-white">Original Language:</span>
                <span className="ml-2">{movie.original_language?.toUpperCase()}</span>
              </li>
              <li>
                <span className="font-semibold text-white">Budget: </span>
                <span className="ml-2">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Revenue:</span>{" "}
                <span className="ml-2">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Production Companies:</span>
                <span className="ml-2">
                  {movie.production_companies?.length > 0
                    ? movie.production_companies.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Countries:</span>
                <span className="ml-2">
                  {movie.production_countries?.length > 0
                    ? movie.production_countries.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Spoken Languages:</span>
                <span className="ml-2">
                  {movie.spoken_languages?.length > 0
                    ? movie.spoken_languages.map((l) => l.english_name).join(", ")
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">
              {movie.tagline || "No tagline available."}
            </p>
            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* ── Recommendations section (unchanged) ───────────── */}
      {recommendations.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">You might also like...</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <div
                key={rec.id}
                className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <Link to={`/movie/${rec.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{rec.title}</h3>
                    <span className="text-xs text-gray-400">
                      {rec.release_date?.slice(0, 4)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;