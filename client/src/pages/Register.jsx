import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import axiosInstance from '../utils/axios'

const Register = () => {
    const [name, setName]=useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [error, setError]=useState(null)
    const {updateUser} =useAuth()
    const navigate =useNavigate()
    const handleSubmit =async (e) => {
        e.preventDefault();
        if(!name || !email || !password){
         setError('All field are required')
         return;
        }
        setError('')
        try {
            const response = await axiosInstance.post('/api/users/register',{name,email,password})
            updateUser(response.data)
            console.log(response.data)
            navigate('/')
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }
 
  return (
    <div className='flex items-center justify-center h-screen '>
        <div className='sm:w-[40%] bg-white rounded-md p-3'>
            <h1 className='text-xl text-center py-3'>Register</h1>
          
            <form onSubmit={handleSubmit}>
                <div className='mt-4'>
                    <label htmlFor="Name" className='block py-3 '>Name</label>
                    <input type="text" placeholder='Name' className='px-4 py-2 rounded-md border-2 w-full focus:outline-dotted' value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className='mt-4'>
                    <label htmlFor="Email" className='block py-3 '>Email</label>
                    <input type="text" placeholder='Email' className='px-4 py-2 rounded-md border-2 w-full focus:outline-dotted' value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <div className='mt-4'>
                    <label htmlFor="Password" className='block py-3 '>Password</label>
                    <input type="password" placeholder='Password' className='px-4 py-2 rounded-md border-2 w-full focus:outline-dotted' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                  {error && <p className='text-red-600 text-sm p-2'>{error}</p>}
                <button type='submit' className='py-2 px-4 rounded-md bg-teal-600 hover:bg-teal-700 text-slate-100 w-full my-4'>Register</button>
                <p className='text-sm text-slate-500 pl-6'>Already have an account? <Link to={'/login'} className='pl-3 text-purple-600 font-bold'>Login</Link></p>
            </form>
        </div>
    </div>
  )
}

export default Register