import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { MdDelete, MdEdit } from "react-icons/md";
const PostCard = ({ post }) => {
  const { user } = useAuth();
  const isAuthor = user && user._id.toString() === post.user._id.toString();
  return (
    <div className=" flex flex-col gap-2 rounded-md bg-white ">
      <div className="overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-64 w-full object-cover"
        />
      </div>

      <div className="mt-3 px-3">
        <h1 className="block text-slate-800 font-bold capitalize">{post.title}</h1>
        <p className="text-slate-500 ">{post.content.slice(0, 30)}...</p>
      </div>
      <div className="flex justify-between items-center">
        <Link
          to={`/posts/${post._id}`}
          className="text-purple-400 hover:text-purple-600 p-4"
        >
          Read more
        </Link>
        {isAuthor && (
          <div className="flex ">
            <Link
              to={`/posts/${post._id}/edit`}
              className="text-blue-400 hover:text-blue-600 p-4"
            >
              <MdEdit size={25} />
            </Link>
            <button className="text-red-600">
              <MdDelete size={25} />{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
