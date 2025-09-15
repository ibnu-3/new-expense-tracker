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
    <div className='flex justify-between items-center p-4  shadow-md bg-white'>
      <Link to={'/'} className='text-xl font-bold italic'>Dashboard</Link>
      <div className='flex gap-3'>
        {user && <div className='h-10 w-10 flex items-center justify-center  rounded-full bg-purple-600 text-slate-300'>{user.name[0].toUpperCase()}</div>}
      <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar