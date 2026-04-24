import express from "express";
const router = express.Router();

import {
  addWatchedMovie,
  getWatchHistory,
  getRecommendations,
} from "../services/recommendationService.js";

/**
 * All routes assume req.user._id is populated by your existing
 * JWT/session auth middleware in the parent WeWatch app.
 *
 * Mount this router in your main app.js:
 *   const recommendationRoutes = require("./routes/recommendations");
 *   app.use("/api/recommendations", recommendationRoutes);
 */

// ─── POST /api/recommendations/watch ─────────────────────────────────────────
/**
 * Record a watched movie for the authenticated user.
 *
 * Body: {
 *   id: number,          // TMDB movie id
 *   title: string,
 *   genre_ids: number[],
 *   overview: string,
 *   vote_average: number,
 *   poster_path: string,   // optional
 *   release_date: string   // optional
 * }
 *
 * Response: { message, history: [last 3 movies] }
 */
router.post("/watch", async (req, res) => {
  try {
    const movie = req.body;

    // Basic validation
    if (!movie || !movie.id || !movie.title) {
      return res.status(400).json({
        error: "Movie object must include at least id and title.",
      });
    }

    const userId = req.user._id;
    const updatedHistory = await addWatchedMovie(userId, movie);

    return res.status(200).json({
      message: "Movie added to watch history.",
      history: updatedHistory.movies,
    });
  } catch (err) {
    console.error("[POST /watch] Error:", err.message);
    return res.status(500).json({ error: "Failed to update watch history." });
  }
});

// ─── GET /api/recommendations/history ────────────────────────────────────────
/**
 * Return the authenticated user's last 3 watched movies.
 *
 * Response: { history: [movie, ...] }
 */
router.get("/history", async (req, res) => {
  try {
    const history = await getWatchHistory(req.user._id);
    return res.status(200).json({ history });
  } catch (err) {
    console.error("[GET /history] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch watch history." });
  }
});

// ─── GET /api/recommendations ─────────────────────────────────────────────────
/**
 * Return top-10 recommended movies for the authenticated user.
 * Results are served from MongoDB cache when available.
 *
 * Response: {
 *   source: "cache" | "computed" | "trending",
 *   recommendations: [movie, ...]
 * }
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await getRecommendations(userId);

    const source =
      results.length && results[0].score === null
        ? "trending"
        : "computed";

    return res.status(200).json({ source, recommendations: results });
  } catch (err) {
    console.error("[GET /recommendations] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch recommendations." });
  }
});
export default router;