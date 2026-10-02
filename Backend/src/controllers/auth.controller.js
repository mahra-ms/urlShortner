import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name !== undefined && (typeof name !== "string" || name.length > 100)) {
      return res.status(400).json({ message: "Invalid name" });
    }
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !EMAIL_RE.test(email)
    ) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res
        .status(400)
        .json({ message: "Password must be 8-72 characters" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    return res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error(error);
    return res.status(500).json({ message: "Unable to sign up" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    const hash = user ? user.password : DUMMY_HASH;
    const match = await bcrypt.compare(password, hash);
    if (!user || !match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({
      success: true,
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to log in" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
