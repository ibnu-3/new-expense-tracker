import jwt from 'jsonwebtoken'
import User from '../models/User.js';
export const protect = async(req,res,next)=>{
    let token;
    token =req.cookies.jwt;
    if(!token){
        res.status(401).json({message:"Not authorized no token"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user =await User.findById(decoded.id).select('-password')
        next();
    } catch (error) {
        console.log(error)
        res.status(403).json({message:"Not authorized token failed"})
        
    }
};