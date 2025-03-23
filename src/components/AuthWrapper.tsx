// AuthWrapper.jsx
import { useEffect, useContext } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getUser, introspect, refresh } from '../data/authData';

const AuthWrapper = ({ children }) => {
  const { user, loginContext, logout, loading, setIsLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if token is valid
        const isValid = await introspect();
        
        if (isValid) {
          // If valid, get user data
          const userData = await getUser();
          if (userData) {
            const role = userData.roles && userData.roles.length > 0 
              ? userData.roles[0].name 
              : '';
            
            loginContext(userData.username || userData.name, role);
          }
        } else {
          // Try to refresh the token
          const refreshResult = await refresh();
          if (refreshResult?.token) {
            localStorage.setItem("token", refreshResult.token);
            const userData = await getUser();
            if (userData) {
              const role = userData.roles && userData.roles.length > 0 
                ? userData.roles[0].name 
                : '';
              
              loginContext(userData.username || userData.name, role);
            }
          } else {
            // If refresh fails, logout
            logout();
            
            // Redirect to login if on a protected route
            const publicPaths = ['/', '/about', '/service', '/blog', '/SkinTest'];
            if (!publicPaths.includes(location.pathname)) {
              navigate('/', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]); // Re-run when route changes
  console.log("authwrapper",user);
  // You can add a loading indicator here
  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default AuthWrapper;