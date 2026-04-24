import WatchHistory from "../models/WatchHistory.js";
import RecommendationCache from "../models/RecommendationCache.js";

import { fetchCandidatesFromTMDB, fetchTrending } from "./tmdbService.js";

import {
  buildGenreProfile,
  topGenres,
  scoreCandidates,
} from "./scoringService.js";

const MAX_HISTORY = 3;
const TOP_N = 10;

// ─── WATCH HISTORY ────────────────────────────────────────────────────────────

/**
 * Record a newly watched movie for a user.
 * Maintains a sliding window of MAX_HISTORY (3) movies.
 * Invalidates any cached recommendations automatically.
 *
 * @param {string} userId  - MongoDB ObjectId string
 * @param {Object} movie   - TMDB movie object { id, title, genre_ids, overview, vote_average, ... }
 * @returns {Promise<Object>} - Updated WatchHistory document
 */
async function addWatchedMovie(userId, movie) {
  let history = await WatchHistory.findOne({ userId });

  const entry = {
    tmdbId: movie.id ?? movie.tmdbId,
    title: movie.title,
    genre_ids: movie.genre_ids || [],
    overview: movie.overview || "",
    vote_average: movie.vote_average || 0,
    poster_path: movie.poster_path || "",
    release_date: movie.release_date || "",
    watchedAt: new Date(),
  };

  if (!history) {
    history = new WatchHistory({ userId, movies: [entry] });
  } else {
    // Avoid duplicate entries
    history.movies = history.movies.filter((m) => m.tmdbId !== entry.tmdbId);
    history.movies.push(entry);

    // We no longer truncate to MAX_HISTORY here to preserve full watch history
    // if (history.movies.length > MAX_HISTORY) {
    //   history.movies = history.movies.slice(-MAX_HISTORY);
    // }
  }

  await history.save();

  // Invalidate stale cached recommendations for this user
  await RecommendationCache.deleteOne({ userId });

  return history;
}

/**
 * Get the last MAX_HISTORY watched movies for a user.
 *
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
async function getWatchHistory(userId) {
  const history = await WatchHistory.findOne({ userId }).lean();
  if (!history || !history.movies.length) return [];
  // Sort newest-first and return ONLY top 3 for recommendation engine
  return [...history.movies].sort(
    (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
  ).slice(0, MAX_HISTORY);
}

// ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

/**
 * Generate (or retrieve from MongoDB cache) the top-10 recommendations
 * for a given user based on their last 3 watched movies.
 *
 * Cache key: userId + sorted list of watched tmdbIds.
 * If the watch history hasn't changed, the cached results are returned
 * (until MongoDB TTL expires them after 10 minutes).
 *
 * @param {string} userId
 * @returns {Promise<Object[]>} - Top 10 scored movie objects
 */
async function getRecommendations(userId) {
  // 1. Load watch history
  const watchedMovies = await getWatchHistory(userId);

  // 2. Fallback: no history → return trending
  if (!watchedMovies.length) {
    const trending = await fetchTrending();
    return trending.slice(0, TOP_N).map((m) => ({
      tmdbId: m.id,
      title: m.title,
      genre_ids: m.genre_ids || [],
      overview: m.overview || "",
      vote_average: m.vote_average || 0,
      poster_path: m.poster_path || "",
      release_date: m.release_date || "",
      score: null,
      scoreBreakdown: null,
    }));
  }

  const currentMovieIds = watchedMovies.map((m) => m.tmdbId).sort();

  // 3. Check MongoDB recommendation cache
  const cached = await RecommendationCache.findOne({ userId }).lean();
  if (
    cached &&
    JSON.stringify(cached.basedOnMovieIds.sort()) ===
    JSON.stringify(currentMovieIds)
  ) {
    return cached.recommendations;
  }

  // 4. Build genre profile and fetch TMDB candidates
  const genreFreq = buildGenreProfile(watchedMovies);
  const genres = topGenres(genreFreq, 2);

  if (!genres.length) return [];

  const candidates = await fetchCandidatesFromTMDB(genres, 3);

  // 5. Exclude already-watched movies
  const watchedIds = new Set(watchedMovies.map((m) => m.tmdbId));
  const filteredCandidates = candidates.filter((m) => !watchedIds.has(m.id));

  // 6. Score and sort
  const scored = scoreCandidates(watchedMovies, filteredCandidates);
  const top10 = scored.sort((a, b) => b.score - a.score).slice(0, TOP_N);

  // 7. Persist results to MongoDB (replaces old cache doc via upsert)
  await RecommendationCache.findOneAndUpdate(
    { userId },
    {
      userId,
      basedOnMovieIds: currentMovieIds,
      recommendations: top10,
      createdAt: new Date(), // reset TTL clock
    },
    { upsert: true, new: true }
  );

  return top10;
}

export {
  addWatchedMovie,
  getWatchHistory,
  getRecommendations,
};