import express from "express";
import Post from "../models/Post";
const router =express.Router();
//get all posts
 router.get('/', async (req,res) => {
    try {
        const posts = await Post.find({}).populate('user',  'name, email').sort({createdAt:-1});
        if(!posts){
            res.status(404).json({message:"posts not found"})
        }
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message})
        console.log(error.message)
    }
 })
 router.post('/', async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message})
        console.log(error.message)
    }
 })
 router.post('/', async (req,res) => {
    const {title, content, image}= req.body;
    try {
        const post = await Post.create({title, content, image, user:req.user._id})
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message})
        console.log(error.message)
    }
 })
export default router