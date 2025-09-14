import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
//import generateToken from "../utils/generateToken.js";
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

export const registerUser = async (req, res) => {
  const { fullName, email, password, profilePic, inviteToken } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(403).json({ message: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";
    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(profilePic, {
        folder: "blog-profile",
      });
       imageUrl = uploadResult.secure_url;
    }

    const isAdmin = inviteToken === process.env.ADMIN_INVITE_TOKEN;
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic: imageUrl,
      isAdmin,
    });
    if (user) {
      generateToken(user._id, res);
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// login user

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(user._id);
      res.status(201).json({
        message: "Login successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(404).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//logout user
export const logoutUser = async (req, res) => {
 res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
}

//get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//update user profile
export const updateUserProfile = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "blog-profile",
      });
      user.profilePic = uploadResult.secure_url;
    }
    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    if (!users) {
      res.status(404).json({ message: "users not found" });
    }
    res.status(201).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    await user.deleteOne();
    res.status(201).json({ message: "user deleted!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
