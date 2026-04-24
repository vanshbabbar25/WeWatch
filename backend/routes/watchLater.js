import express from "express";
import WatchLater from "../models/WatchLater.js";
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


// ===== ADD TO WATCH LATER =====
router.post("/add", auth, async (req, res) => {
    try {
        const { movieId, title, poster } = req.body;

        const item = await WatchLater.create({
            userId: req.userId,
            movieId,
            title,
            poster,
        });

        res.status(200).json({ message: "Added to Watch Later", item });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Already added" });
        }
        res.status(500).json({ message: err.message });
    }
});


// ===== GET WATCH LATER =====
router.get("/", auth, async (req, res) => {
    try {
        const list = await WatchLater.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ list });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ===== REMOVE =====
router.delete("/:movieId", auth, async (req, res) => {
    try {
        await WatchLater.findOneAndDelete({
            userId: req.userId,
            movieId: req.params.movieId,
        });

        res.status(200).json({ message: "Removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;