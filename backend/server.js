import express from 'express';
import { connectToDB } from './config/db.js';
import User from './models/user.model.js';
import bcryptjs from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS for production only (frontend deployed at Render)
const allowedOrigins = [
  "https://wewatch-1.onrender.com", // ✅ your frontend URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new Error("All fields are required!");
    }

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) return res.status(400).json({ message: "User already exists." });
    if (usernameExists) return res.status(400).json({ message: "Username is taken." });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userDoc = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ user: userDoc, message: "User created successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) return res.status(400).json({ message: "Username not found." });

    const isValid = bcryptjs.compareSync(password, userDoc.password);
    if (!isValid) return res.status(400).json({ message: "Invalid password." });

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ user: userDoc, message: "Logged in successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/fetch-user", async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await User.findById(decoded.id).select("-password");

    if (!userDoc) return res.status(400).json({ message: "No user found." });

    res.status(200).json({ user: userDoc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Start server
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on port ${PORT}`);
});
