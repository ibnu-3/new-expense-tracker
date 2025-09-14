import User from "../models/User.js";
import jwt from 'jsonwebtoken'
export const protect = async (req,res,next) => {
    let token;
    if(req.cookies.jwt){
        try {
            token = req.cookies.jwt;
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            req.user= await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({message:"Not authorized, token failed"})
        }
    }
    if(!token){
        return res.status(401).json({message:'Not authorized, no token'})
    }
}

export const admin = async (req,res,next) => {
   if(req.user && req.user.isAdmin){
    next()
   }else{
    res.status(401).json({message:'Not authorized, admin only'})
   }
}