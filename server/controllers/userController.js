import bcrypt from 'bcryptjs'

import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req,res) => {
    const {fullName, email, password, profilePic}=req.body;
    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(403).json({message:'user already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl='';
        if(profilePic){
            const uploadResult = await cloudinary.uploader.upload(image,{folder:'blog-profile'});
            imageUrl = uploadResult.secure_url;
        }

        const user = await User.create({
            fullName, email,
            password:hashedPassword,
            profilePic:imageUrl,
        });
        if(user){
            generateToken(user._id, res);
            res.status(201).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
                isAdmin:user.isAdmin,
            })
        }else{
            res.status(400).json({message:'Invalid user data'})
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"server error",error:error.message})
    }
}

// login user

export const loginUser = async (req,res) => {
    const {email, password} =req.body;
    try {
        const user =await User.findOne({email})
        if(user && (await bcrypt.compare(password, user.password))){
            generateToken(user._id)
            res.status(201).json({message:'Login successfully', user:{
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
                isAdmin:user.isAdmin,
            }})
        }else{
            res.status(404).json({message:"Invalid credentials"})
        }
    } catch (error) {
         console.log(error.message)
        res.status(500).json({message:"server error",error:error.message})
    }
}

//get user profile
export const getUserProfile=async (req,res) => {
    try {
        const user =await User.findById(req.user.id).select('-password')
        if(!user){
             res.status(404).json({message:'user not found'})
        }
         res.status(201).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
                isAdmin:user.isAdmin,
            })
    } catch (error) {
          console.log(error.message)
        res.status(500).json({message:"server error",error:error.message})
    }
}