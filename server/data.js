import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import User from "../models/User.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
dotenv.config();

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id, res) => {
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

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, inviteToken,profilePic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  let imageUrl = "";
  if (profilePic) {
    const uploadResult = await cloudinary.uploader.upload(profilePic, {
      folder: "blog-profile",
    });
    imageUrl = uploadResult.secure_url;
  }

  const isAdmin = inviteToken === process.env.ADMIN_INVITE_TOKEN;

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    profilePic: imageUrl,
  });

  if (user) {
    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateToken(user._id, res);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
router.post("/logout", (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  // The protect middleware already verifies the token and sets req.user
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});
router.get("/", protect,admin, async (req, res) => {
  // The protect middleware already verifies the token and sets req.user
  const users =await User.find({}).select('-password')
  if(!users){
    res.status(404).json({message:"users not found"})
  }
  res.json(users);
});

export default router;

// import express from 'express'
// import { deleteUser, getUserProfile, getUsers, loginUser, registerUser, updateUserProfile } from '../controllers/userController.js';
// import { admin, protect } from '../middleware/authMiddleware.js';
// const router = express.Router();
// router.post('/register', registerUser)
// router.post('/login', loginUser)
// router.get('/:id',protect, getUserProfile)
// router.put('/:id',protect, updateUserProfile)
// router.get('/',protect,admin, getUsers)
// router.delete('/:id',protect,admin, deleteUser)
// export default router
