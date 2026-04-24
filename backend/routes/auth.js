import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // adjust path

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already exists."
            : "Username is taken.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    // Remove password before sending
    const user = userDoc.toObject();
    delete user.password;

    return res.status(201).json({
      user,
      message: "User created successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Allow login via email OR username
    const userDoc = await User.findOne({
      $or: [{ email: username }, { username }],
    });

    if (!userDoc) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, userDoc.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate token
    const token = jwt.sign(
      { id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    // Remove password
    const user = userDoc.toObject();
    delete user.password;

    return res.status(200).json({
      user,
      message: "Logged in successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ===== FETCH USER =====
router.get("/fetch-user", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const userDoc = await User.findById(decoded.id).select("-password");

    if (!userDoc) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: userDoc });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ===== LOGOUT =====
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

export default router;