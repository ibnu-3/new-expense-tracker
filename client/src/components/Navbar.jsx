import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaMoneyBillWave, FaChartPie, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-white text-lg font-bold flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    Expense Tracker
                </Link>

                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center">
                        <FaChartPie className="mr-1" />
                        Dashboard
                    </Link>
                    {user && (
                        <>
                            <Link to="/income" className="text-gray-300 hover:text-white">Income</Link>
                            <Link to="/expenses" className="text-gray-300 hover:text-white">Expenses</Link>
                        </>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className="text-gray-300 hover:text-white flex items-center">
                            <FaSignOutAlt className="mr-1" />
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white flex items-center">
                                <FaSignInAlt className="mr-1" />
                                Login
                            </Link>
                            <Link to="/register" className="text-gray-300 hover:text-white flex items-center">
                                <FaUserPlus className="mr-1" />
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;