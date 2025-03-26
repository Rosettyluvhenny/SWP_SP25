import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

export const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { user, hasRole, setIsLoginOpen } = useContext(UserContext);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoginOpen(true);
      toast.error("Bạn không có quyền truy cập", { toastId: 'auth-error', autoClose: 3000 });
      setIsAllowed(false);
    } else if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
      toast.error("Bạn không có quyền truy cập", { toastId: 'auth-error', autoClose: 3000 });
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
  }, [user, requiredRoles, hasRole, setIsLoginOpen]);

  if (isAllowed === null) return null; 

  return isAllowed ? <Outlet /> : <Navigate to="/home" />;
};
