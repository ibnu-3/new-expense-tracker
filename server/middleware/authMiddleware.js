import User from "../models/User.js";
import jwt, { decode } from 'jsonwebtoken'
export const protect = async (req,res) => {
    let token;
    if(req.cookies.jwt){
        try {
            token = req.cookies.jwt;
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            req.user= await User.findById(decoded.id).select('-password')
        } catch (error) {
            
        }
    }
}