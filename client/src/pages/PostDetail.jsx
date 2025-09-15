import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const [post, setPost] = useState(null);
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
    <div>
      <div>
        <img src={post.image} alt={post.title} />
      </div>
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>Created By {post.user} on {post.createdAt}</p>
      </div>
    </div>
  );
};

export default PostDetail;
