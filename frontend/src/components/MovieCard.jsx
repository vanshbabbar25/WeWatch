/**
 * components/MovieCard.jsx
 * -------------------------
 * Displays a single movie with poster, title, rating and score breakdown.
 * The "Mark as Watched" button fires markAsWatched() from context.
 */

import { useState } from "react";
import { useRecommendation } from "../context/RecommendationContext";

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";
const PLACEHOLDER = "https://via.placeholder.com/342x513?text=No+Poster";

export default function MovieCard({ movie, showScore = false }) {
  const { markAsWatched, watchHistory } = useRecommendation();
  const [marking, setMarking] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const isWatched = watchHistory.some((m) => m.tmdbId === movie.tmdbId || m.tmdbId === movie.id);

  const handleWatch = async () => {
    setMarking(true);
    // Normalise: MovieCard may receive raw TMDB shape (id) or stored shape (tmdbId)
    const payload = {
      id: movie.id ?? movie.tmdbId,
      title: movie.title,
      genre_ids: movie.genre_ids || [],
      overview: movie.overview || "",
      vote_average: movie.vote_average || 0,
      poster_path: movie.poster_path || "",
      release_date: movie.release_date || "",
    };
    await markAsWatched(payload);
    setMarking(false);
  };

  const posterUrl = movie.poster_path
    ? `${TMDB_IMG}${movie.poster_path}`
    : PLACEHOLDER;

  const scorePercent = movie.score != null
    ? Math.round(movie.score * 100)
    : null;

  return (
    <div className="movie-card" data-watched={isWatched}>
      {/* Score badge */}
      {showScore && scorePercent !== null && (
        <div
          className="score-badge"
          title="Match score"
          onClick={() => setShowBreakdown((s) => !s)}
        >
          {scorePercent}%
          {showBreakdown && movie.scoreBreakdown && (
            <div className="score-tooltip">
              <span>🎭 Genre: {Math.round(movie.scoreBreakdown.genreScore * 100)}%</span>
              <span>📝 Story: {Math.round(movie.scoreBreakdown.descSimilarity * 100)}%</span>
              <span>⭐ Rating: {Math.round(movie.scoreBreakdown.ratingScore * 100)}%</span>
            </div>
          )}
        </div>
      )}

      <div className="card-poster-wrap">
        <img
          src={posterUrl}
          alt={movie.title}
          className="card-poster"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {isWatched && <div className="watched-overlay">✓ Watched</div>}
      </div>

      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>

        <div className="card-meta">
          <span className="card-rating">★ {movie.vote_average?.toFixed(1)}</span>
          {movie.release_date && (
            <span className="card-year">{movie.release_date.slice(0, 4)}</span>
          )}
        </div>

        {movie.overview && (
          <p className="card-overview">
            {movie.overview.length > 120
              ? movie.overview.slice(0, 120) + "…"
              : movie.overview}
          </p>
        )}

        <button
          className={`watch-btn ${isWatched ? "watched" : ""}`}
          onClick={handleWatch}
          disabled={marking || isWatched}
        >
          {marking ? "Adding…" : isWatched ? "✓ Watched" : "Mark as Watched"}
        </button>
      </div>
    </div>
  );
}