/**
 * components/WatchHistoryStrip.jsx
 * ----------------------------------
 * Horizontal strip showing the last 3 watched movies.
 * Appears at the top of the recommendations page.
 */

import { useWatchHistory } from "../hooks/useMovieRecommendations";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";

export default function WatchHistoryStrip() {
  const { watchHistory, loading } = useWatchHistory();

  if (loading) return <div className="history-strip skeleton-strip" />;
  if (!watchHistory.length) return null;

  return (
    <div className="history-strip">
      <p className="history-label">Based on your last {watchHistory.length} watched</p>
      <div className="history-movies">
        {watchHistory.map((m) => (
          <div key={m.tmdbId} className="history-chip">
            {m.poster_path ? (
              <img
                src={`${TMDB_IMG}${m.poster_path}`}
                alt={m.title}
                className="history-thumb"
              />
            ) : (
              <div className="history-thumb placeholder-thumb" />
            )}
            <span className="history-chip-title">{m.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}