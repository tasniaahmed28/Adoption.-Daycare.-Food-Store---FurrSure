import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return children;
};

export default AdminProtectedRoute;