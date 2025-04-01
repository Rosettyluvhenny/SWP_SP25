
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

export const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { user, hasRole, setIsLoginOpen, loading } = useContext(UserContext);
  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Consider using a proper loading spinner
  }

  // Check access function
  const checkAccess = () => {
    // Check if user exists
    if (!user) {
      setIsLoginOpen(true);
      // toast.error("Bạn không có quyền truy cập", {
      //   toastId: 'auth-error',
      //   autoClose: 3000
      // });
      return false;
    }

    // Check role-based access if required roles are specified
    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
      // toast.error("Bạn không có quyền truy cập", {
      //   toastId: 'auth-error',
      //   autoClose: 3000
      // });
      return false;
    }

    return true;
  };

  // Render based on access check
  return checkAccess() ? <Outlet /> 
  : <Navigate to="/home" replace />;
};