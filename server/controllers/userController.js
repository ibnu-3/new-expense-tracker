import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";
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
    let imageUrl = "";
    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(profilePic, {
        folder: "blog-profile",
      });
      return (imageUrl = uploadResult.secure_url);
    }

    const isAdmin =
      inviteToken && inviteToken === process.env.ADMIN_INVITE_TOKEN;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashedPassword,
      profilePic: imageUrl,
      isAdmin,
    });
    await user.save();

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
//login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
     return res.status(401).json({ message: "invalid credentials" });
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
//logout user
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successfully" });
};
//get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      return res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
};

//update user profile
export const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      
      if (password) {
        return (user.password = await bcrypt.hash(password, 10));
      }

      const updatedUser = await user.save();
      res.status(201).json({message:'user updated!',user:{
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        profilePic: updatedUser.profilePic,
      }});
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
};
//update profile 
export const updateProfilePic=async (req,res) => {
  const {profilePic}=req.body;
  try {
    const user =await User.findById(req.user._id)
    if(user){
      if(profilePic){
        const uploadResult =await cloudinary.uploader.upload(profilePic, {folder:"blog-post"});
        user.profilePic = uploadResult.secure_url;
      };
      const updatedUser = await user.save()
      res.status(201).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        isAdmin:updatedUser.isAdmin,
        profilePic:updatedUser.profilePic,
      })
    }else{
      res.json({message:"user not found"})
    }
  } catch (error) {
      res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
}

//get all users
export const getAllUsers = async (req,res) => {
  try {
    const users = await User.find({}).select('-password')
    if(!users){
      return res.status(404).json({message:"users not found"})
    };
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
}
//delete user
export const deleteUser=async (req,res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user){
      res.json({message:"user not found"})
    }
    await user.deleteOne()
    res.json({message:"user removed"})
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
}
export default router;
