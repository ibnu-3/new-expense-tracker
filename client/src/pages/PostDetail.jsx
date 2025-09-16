import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { Link, useParams } from "react-router-dom";

const PostDetail = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/${id}`);
        console.log(response.data);
        setPost(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost()
  }, []);
  return (
    <div className="px-3 sm:px-6">
      <h1 className="text-center font-bold underline py-3">Post Details</h1>
      <Link to={'/'} className="px-4 py-2  bg-teal-600 text-slate-200  rounded-md">Back to Home</Link>
    {post.image && (
        <div className="mt-4">
        <img src={post.image} alt={post.title} className="h-96 w-full object-center rounded-md"/>
      </div>
    )}
      <div className="p-3 ">
        <h1 className="text-xl font-bold">{post.title}</h1>
        <p>{post.content}</p>
        <p className="text-sm text-slate-600">Created By <span className="text-black font-bold">{post.user?.email}</span> on {post.createdAt}</p>
      </div>
    </div>
  );
};

export default PostDetail;
