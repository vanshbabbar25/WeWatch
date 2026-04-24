import express from "express";
import WatchHistory from "../models/WatchHistory.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔐 Middleware to get user
const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

// ===== ADD TO history =====
router.post("/add", auth, async (req, res) => {
    // Note: the application actually adds to history via the recommendation engine API (/api/recommendations/watch)
    // We leave this endpoint here for completeness if frontend calls it directly.
    return res.status(200).json({ message: "Please use /api/recommendations/watch to add to history." });
});

// ===== GET HISTORY =====
router.get("/", auth, async (req, res) => {
    try {
        const historyDoc = await WatchHistory.findOne({ userId: req.userId }).lean();
        if (!historyDoc || !historyDoc.movies) {
            return res.status(200).json({ list: [] });
        }
        
        const sorted = [...historyDoc.movies].sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
        const list = sorted.map(m => ({
            movieId: m.tmdbId.toString(),
            title: m.title,
            poster: m.poster_path
        }));

        res.status(200).json({ list });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ===== REMOVE =====
router.delete("/:movieId", auth, async (req, res) => {
    try {
        await WatchHistory.updateOne(
            { userId: req.userId },
            { $pull: { movies: { tmdbId: Number(req.params.movieId) } } }
        );

        res.status(200).json({ message: "Removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;