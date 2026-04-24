/**
 * hooks/useMovieRecommendations.js
 * ----------------------------------
 * Convenience wrapper: auto-fetches recommendations on first render
 * and exposes a refresh() helper for manual reload.
 *
 * Usage:
 *   const { recommendations, loading, error, refresh } = useMovieRecommendations();
 */

import { useEffect, useCallback } from "react";
import { useRecommendation } from "../context/RecommendationContext";

export function useMovieRecommendations() {
  const {
    recommendations,
    recSource,
    loadingRecs,
    errorRecs,
    loadRecommendations,
  } = useRecommendation();

  // Auto-fetch on mount if recommendations haven't been loaded yet
  useEffect(() => {
    if (recommendations.length === 0 && !loadingRecs) {
      loadRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => loadRecommendations(), [loadRecommendations]);

  return {
    recommendations,
    source: recSource,
    loading: loadingRecs,
    error: errorRecs,
    refresh,
  };
}

/**
 * hooks/useWatchHistory.js (bundled here for convenience)
 * --------------------------------------------------------
 * Auto-fetches the last 3 watched movies on mount.
 *
 * Usage:
 *   const { watchHistory, loading, markAsWatched } = useWatchHistory();
 */
export function useWatchHistory() {
  const {
    watchHistory,
    loadingHistory,
    errorHistory,
    loadWatchHistory,
    markAsWatched,
  } = useRecommendation();

  useEffect(() => {
    if (watchHistory.length === 0 && !loadingHistory) {
      loadWatchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    watchHistory,
    loading: loadingHistory,
    error: errorHistory,
    markAsWatched,
    reload: loadWatchHistory,
  };
}