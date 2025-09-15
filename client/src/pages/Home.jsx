import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../utils/axios'
import PostCard from '../components/PostCard'

const Home = () => {
  const [posts, setPosts] =useState([])
  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('/api/posts')
        console.log(response.data)
        setPosts(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()
  },[])
  return (
    <div>
      <Navbar/>
      <div className='mt-4'>
        <h1 className='text-center text-xl font-bold underline'>Posts</h1>
        <div className='mt-4 px-3 sm:px-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 '>
            {posts.map((post)=>(
              <PostCard key={post._id} post={post}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home