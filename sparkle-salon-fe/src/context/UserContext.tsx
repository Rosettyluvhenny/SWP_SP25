import React, { useEffect, useRef, useState } from 'react'
import { introspect, getUser, refresh } from '../data/authData';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
const UserContext = React.createContext({
    // user: { name: '', auth: false, role: '' },
    // loginContext: () => {},
    // logout: () => {},
    // loading: true,
    // isLoginOpen: false,
    // setIsLoginOpen: () => {},
    // hasRole: () => false
  });

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : { name: '', auth: false, role: '' };
    });
    const [loading, setIsLoading] = useState(true);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    // const location = useLocation();
    const apiCallTracker = useRef({
        introspectCalled: false,
        refreshCalled: false
    });
    useEffect(() => {
        async function validateAndSetUser() {
            setIsLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                if (!apiCallTracker.current.introspectCalled) {
                    apiCallTracker.current.introspectCalled = true;
                    const response = await introspect();
                    console.log("introspect", response);
                    if (response) {
                        const userData = await getUser();
                        console.log("role: ",userData.role[0].name);
                        if (userData) {
                            setUser({
                                name: `${userData.username}`,
                                auth: true,
                                role: `${userData.roles[0].name}`
                            });
                            console.log("data",userData);
                        }
                    } else {
                        // Only call refresh if it hasn't been called yet
                        if (!apiCallTracker.current.refreshCalled) {
                            apiCallTracker.current.refreshCalled = true;
                            const refreshResponse = await refresh();
                            console.log("refresh", refreshResponse);
                            
                            if (refreshResponse?.token) {
                                localStorage.setItem("token", refreshResponse.token);
                                const userData = await getUser();
                                console.log(userData.role);
                                if (userData) {
                                    setUser({
                                        name: `${userData.username}`,
                                        auth: true,
                                        role: `${userData.roles[0].name}`
                                    });
                                }
                            } else {
                                toast.error("Your access is expired");
                                logout();
                            }
                        }
                    }
                }
            } catch (error) {
                // Handle error by clearing token and setting auth to false
                toast.error("Your access is expired");
            } finally {
                setIsLoading(false);
            }
        }
        validateAndSetUser();
        console.log("user", user);
        console.log("user json",JSON.stringify(user));

        localStorage.setItem("user", JSON.stringify(user)); 
    }, [localStorage.getItem("token")]);
    const loginContext = (name, role) => {
            setUser({
                name: `${name}`,
                auth: true,
                role: role
            });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        setUser((user) => ({
            name: '',
            auth: false,
            role: ''
        }))
        setIsLoginOpen(true);
    }
    
    const hasRole = (roleName:string) => {
        console.log("check",user.role === roleName )
        if (!user || !user.role) return false;
        return user.role === roleName;
      };

    return (
        <UserContext.Provider value={{ user, loginContext, logout, loading, isLoginOpen, setIsLoginOpen, hasRole}}>
            {children}
        </UserContext.Provider>
    );
};
export { UserContext, UserProvider }
