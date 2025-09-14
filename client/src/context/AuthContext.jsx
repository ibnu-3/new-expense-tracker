import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/apiPaths';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial loading
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth/me`);
        setUser(response.data);
      } catch (error) {
        // Token invalid or not present.  Not necessarily an error, could just be unauthenticated
        setUser(null);
      } finally {
        setLoading(false); // Authentication check is complete
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, { username, email, password });
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}  {/* Only render children when loading is false */}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };