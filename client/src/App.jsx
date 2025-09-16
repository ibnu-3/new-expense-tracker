import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
   <BrowserRouter>
    <AuthProvider>
      
      <div className="max-w-7xl mx-auto">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-post"
          element={
            <PrivateRoute>
              <AddPost />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
         
              <PostDetail />
            
          }
        />
      </Routes>
    </div>
    </AuthProvider>
   </BrowserRouter>
  );
};

export default App;
