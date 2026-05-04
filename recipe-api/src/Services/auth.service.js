import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🎫 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// 📝 Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔑 Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: "Login successful",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
