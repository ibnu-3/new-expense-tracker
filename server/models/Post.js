import mongoose from "mongoose";

const postSchema= new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, required:true, },
    title:{type:String,required:true },
    content:{type:String,required:true },
    image:{type:String, default:'', },
    tags:{type:[String], default:[] },
},{timestamps:true});
const Post = mongoose.model('Post', postSchema)
export default Post;