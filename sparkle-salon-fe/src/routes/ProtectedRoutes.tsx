import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext, UserProvider } from '../context/UserContext';
import { toast } from 'react-toastify';
import { getUser } from '../data/authData';

export const ProtectedRoute = ({ requiredRoles = [] }) => {
  // const { user, hasRole, setIsLoginOpen, loginContext } = useContext(UserContext);
  // Check if user is logged in
    const {user, hasRole} = useContext(UserContext);
    
    if (!user) {
      toast.error("Bạn không có quyền truy cập")
      return <Navigate to="/home" />;
    }

    // Check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
      toast.error("Bạn không có quyền truy cập")
      return <Navigate to="/home" />;
    }

    return <Outlet />;
  };

