import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
};

//register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.json({ message: "invalid user data" });
    }
  } catch (error) {
    req.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
});

//login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.json({ message: "invalid credentials" });
    }
  } catch (error) {
    req.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
});

//getUser profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    req.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
});

//updateUser profile
router.put("/me", protect, async (req, res) => {
    const {name, email, password} =req.body;
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    if(password){
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save();
    res.status(200).json({message:"user updated", user:{
         _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
    }});
  } catch (error) {
    req.status(500).json({ message: "server error", error: error.message });
    console.log(error.message);
  }
});
//logout user
router.post('/logout', (req,res)=>{
    res.cookie('jwt', '',{
        httpOnly:true,
        expires: new Date(0),
        secure: process.env.NODE_ENV !== 'development',
        sameSite:'strict',
    });
    res.status(200).json({message:"Logged out successfully"})
})

export default router;
