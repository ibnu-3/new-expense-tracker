import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
dotenv.config();

const router = express.Router();

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

//register user
export const registerUser = async (req, res) => {
  const { name, email, password, profilePic, inviteToken } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "user already exists" });
    }

    let imageUrl = "";
    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(profilePic, {
        folder: "blog-profile",
      });
      imageUrl = uploadResult.secure_url;
    }

    const isAdmin =
      inviteToken && inviteToken === process.env.ADMIN_INVITE_TOKEN;
    const user = await User.create({
      email,
      name,
      password,
      profilePic: imageUrl,
      isAdmin,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
      });
    } else {
      req.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
};
//login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return req.status(401).json({ message: "invalid credentials" });
    }
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
};

export default router;
