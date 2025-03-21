import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  const { user, hasRole, setIsLoginOpen } = useContext(UserContext);
  
  // Check if user is logged in
  if (!user) {
    setIsLoginOpen(true);
    return <Navigate to="/home" />;
  }
  
  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(user, role))) {
    return 
  }
  
  return element;
};