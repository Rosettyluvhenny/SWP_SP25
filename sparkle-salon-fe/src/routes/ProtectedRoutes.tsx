import React, { useContext, useEffect, useRef } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { UserContext, UserProvider } from '../context/UserContext';
import { toast } from 'react-toastify';

export const ProtectedRoute = ({ requiredRoles = [] }) => {

  const {user, hasRole,setIsLoginOpen} = useContext(UserContext);
  const checkAccess = () => {
    if (!user) {
      setIsLoginOpen(true);
      toast.error("Bạn không có quyền truy cập", {
        toastId: 'auth-error', // Prevent duplicate toasts
        autoClose: 3000
      });
      return false;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
      toast.error("Bạn không có quyền truy cập", {

        toastId: 'auth-error', // Prevent duplicate toasts
        autoClose: 3000
      });
      return false;
    }

    return true;
  };

  return checkAccess() ? <Outlet /> : <Navigate to="/home" />;
};