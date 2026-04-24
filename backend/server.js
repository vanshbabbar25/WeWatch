import express from "express";
import { connectToDB } from "./config/db.js";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import recommendation from "./routes/recommendation.js";
import auth from "./routes/auth.js";
import watchLater from "./routes/watchLater.js";
import history from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://we-watch-eight.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());



// ===== AUTH MIDDLEWARE =====
const requireAuth = async (req, res, next) => {
  console.log("COOKIES:", req.cookies);

  const { token } = req.cookies;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded); // 👈 ADD THIS

    const userDoc = await User.findById(decoded.id);
    console.log("USER:", userDoc); // 👈 ADD THIS

    if (!userDoc) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userDoc;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message); // 👈 ADD THIS
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// ===== ROUTES =====
app.use("/api", auth);
app.use("/api/recommendations", requireAuth, recommendation);
app.use("/api/watch-later", watchLater);
app.use("/api/history", history);



app.get("/", (req, res) => {
  res.send("Server is running.");
});


// ===== START SERVER =====
app.listen(PORT, () => {
  connectToDB()
    .then(() => console.log(`Server is running on port ${PORT}`))
    .catch((err) => console.error("Database connection failed", err));
});