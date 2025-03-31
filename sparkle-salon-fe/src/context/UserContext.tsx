import React, { useEffect, useRef, useState } from 'react'
import { introspect, getUser, refresh } from '../data/authData';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
const UserContext = React.createContext({
  });

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ name: '', auth: false, role: '' });
    const [loading, setIsLoading] = useState(true);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        async function validateAndSetUser() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // Single attempt to validate token
                const response = await introspect();
                
                if (response) {
                    const userData = await getUser();
                    if (userData) {
                        setUser({
                            name: userData.username,
                            auth: true,
                            role: userData.roles[0].name
                        });
                    }
                } else {
                    // Attempt to refresh token
                    const refreshResponse = await refresh();
                    
                    if (refreshResponse?.token) {
                        localStorage.setItem("token", refreshResponse.token);
                        const userData = await getUser();
                        
                        if (userData) {
                            setUser({
                                name: userData.username,
                                auth: true,
                                role: userData.roles[0].name
                            });
                        }
                    } else {
                        // Clear token if refresh fails
                        localStorage.removeItem("token");
                    }
                }
            } catch (error) {
                console.error("Authentication error:", error);
                localStorage.removeItem("token");
            } finally {
                setIsLoading(false);
                isInitialized.current = true;
            }
        }

        validateAndSetUser();
    }, []);
    const loginContext = (name, role) => {
        setUser({
            name: `${name}`,
            auth: true,
            role: role
        });
};

const logout = () => {
    localStorage.removeItem("token");
    setUser((user) => ({
        name: '',
        auth: false,
        role: ''
    }))
    setIsLoginOpen(true);
}

const hasRole = (roleName:string) => {
    if (!user || !user.role) return false;
    return user.role === roleName;
  };

return (
    <UserContext.Provider value={{ user, loginContext, logout, loading,setIsLoading, isLoginOpen, setIsLoginOpen, hasRole}}>
        {children}
    </UserContext.Provider>
);
};
export { UserContext, UserProvider };
