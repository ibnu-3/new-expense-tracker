import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error); // Log the error
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Set JWT as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
            sameSite: 'strict', // helps prevent CSRF attacks
            maxAge: eval(process.env.JWT_EXPIRY)* 24 *60* 60 *1000 || 7* 24 *60* 60 *1000, // expires in 7 days
        });

        res.status(200).json({ message: 'Logged in successfully', user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Failed to get current user', error: error.message });
    }
  };