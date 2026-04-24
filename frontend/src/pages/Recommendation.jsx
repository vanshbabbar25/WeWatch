/**
 * pages/RecommendationsPage.jsx
 * --------------------------------
 * Full recommendations page.
 * Drop this into your React Router:
 *   <Route path="/recommendations" element={<RecommendationsPage />} />
 */

import { useMovieRecommendations } from "../hooks/useMovieRecommendations";
import WatchHistoryStrip from "../components/WatchHistoryStrip";
import MovieCard from "../components/MovieCard";

const SOURCE_LABELS = {
  computed: "Personalised for you",
  trending: "Trending this week",
  cache: "Personalised for you",
};

export default function RecommendationsPage() {
  const { recommendations, source, loading, error, refresh } =
    useMovieRecommendations();

  return (
    <div className="recs-page">
      {/* ── Header ────────────────────────────────────────── */}
      <header className="recs-header">
        <div className="recs-header-text">
          <h1 className="recs-title">
            <span className="title-accent">We</span>Watch
          </h1>
          <p className="recs-subtitle">
            {source ? SOURCE_LABELS[source] || "Recommendations" : "Your Picks"}
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={refresh}
          disabled={loading}
          title="Refresh recommendations"
        >
          {loading ? (
            <span className="spin">⟳</span>
          ) : (
            <span>⟳ Refresh</span>
          )}
        </button>
      </header>

      {/* ── Watch history strip ───────────────────────────── */}
      <WatchHistoryStrip />

      {/* ── States ───────────────────────────────────────── */}
      {error && (
        <div className="recs-error">
          <p>⚠ {error}</p>
          <button onClick={refresh}>Try again</button>
        </div>
      )}

      {loading && (
        <div className="recs-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="movie-card skeleton-card" />
          ))}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="recs-empty">
          <p>Nothing to show yet.</p>
          <p>Start watching movies to get personalised picks! 🎬</p>
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <>
          <p className="recs-count">{recommendations.length} movies matched</p>
          <div className="recs-grid">
            {recommendations.map((movie) => (
              <MovieCard
                key={movie.tmdbId}
                movie={movie}
                showScore={source !== "trending"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}