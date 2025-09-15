import React from 'react'
import { useAuth } from '../context/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const {user, logout}= useAuth()
  const navigate =useNavigate()
  const handleLogout =async ()=>{
    await logout()
    navigate('/login')
  }
  return (
    <div className='flex justify-between items-center p-4 rounded-2xl shadow-md bg-white px-6 sm:px-8'>
      <Link to={'/'} className='text-xl font-bold italic'>Dashboard</Link>
      <div className='flex gap-3'>
        {user && <>
        <div className='h-10 w-10 flex items-center justify-center  rounded-full bg-purple-600 text-slate-300'>{user.name[0].toUpperCase()}</div>
      <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-slate-200 rounded-md hover:bg-red-600'>Logout</button></>}
      </div>
    </div>
  )
}

export default Navbar