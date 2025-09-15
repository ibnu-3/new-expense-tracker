import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("api/users/me");
        setUser(response.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
       await axiosInstance.post('/api/users/logout');
       setUser(null); 
    } catch (error) {
        console.log('logout error ' , error)
    }
  }

  const value = { user, updateUser, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
