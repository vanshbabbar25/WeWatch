import { createContext, useContext, useReducer, useCallback } from "react";
import {
  postWatchedMovie,
  fetchWatchHistory,
  fetchRecommendations,
} from "../api/recommendationApi";

// ─── STATE SHAPE ─────────────────────────────────────────────────────────────

const initialState = {
  watchHistory: [],         // last 3 watched movie objects
  recommendations: [],      // top-10 scored movie objects
  recSource: null,          // "computed" | "trending" | "cache"
  loadingHistory: false,
  loadingRecs: false,
  errorHistory: null,
  errorRecs: null,
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    // Watch history
    case "HISTORY_REQUEST":
      return { ...state, loadingHistory: true, errorHistory: null };
    case "HISTORY_SUCCESS":
      return { ...state, loadingHistory: false, watchHistory: action.payload };
    case "HISTORY_FAILURE":
      return { ...state, loadingHistory: false, errorHistory: action.payload };

    // Add watched
    case "ADD_WATCHED_SUCCESS":
      return { ...state, watchHistory: action.payload };

    // Recommendations
    case "RECS_REQUEST":
      return { ...state, loadingRecs: true, errorRecs: null };
    case "RECS_SUCCESS":
      return {
        ...state,
        loadingRecs: false,
        recommendations: action.payload.recommendations,
        recSource: action.payload.source,
      };
    case "RECS_FAILURE":
      return { ...state, loadingRecs: false, errorRecs: action.payload };

    default:
      return state;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const RecommendationContext = createContext(null);

export function RecommendationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** Load the user's last 3 watched movies from the backend */
  const loadWatchHistory = useCallback(async () => {
    dispatch({ type: "HISTORY_REQUEST" });
    try {
      const { data } = await fetchWatchHistory();
      dispatch({ type: "HISTORY_SUCCESS", payload: data.history });
    } catch (err) {
      dispatch({
        type: "HISTORY_FAILURE",
        payload: err.response?.data?.error || err.message,
      });
    }
  }, []);

  /**
   * Mark a movie as watched.
   * Accepts the same TMDB movie shape your MovieCard already uses.
   */
  const markAsWatched = useCallback(async (movie) => {
    try {
      const { data } = await postWatchedMovie(movie);
      dispatch({ type: "ADD_WATCHED_SUCCESS", payload: data.history });
      // Invalidate recommendations so next load fetches fresh ones
      dispatch({ type: "RECS_SUCCESS", payload: { recommendations: [], source: null } });
    } catch (err) {
      console.error("markAsWatched error:", err.message);
    }
  }, []);

  /** Fetch top-10 recommendations for the current user */
  const loadRecommendations = useCallback(async () => {
    dispatch({ type: "RECS_REQUEST" });
    try {
      const { data } = await fetchRecommendations();
      dispatch({
        type: "RECS_SUCCESS",
        payload: { recommendations: data.recommendations, source: data.source },
      });
    } catch (err) {
      dispatch({
        type: "RECS_FAILURE",
        payload: err.response?.data?.error || err.message,
      });
    }
  }, []);

  return (
    <RecommendationContext.Provider
      value={{
        ...state,
        loadWatchHistory,
        markAsWatched,
        loadRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

/** Custom hook — import this in any component */
// eslint-disable-next-line react-refresh/only-export-components
export function useRecommendation() {
  const ctx = useContext(RecommendationContext);
  if (!ctx)
    throw new Error("useRecommendation must be used inside <RecommendationProvider>");
  return ctx;
}