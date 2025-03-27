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
    const apiCallTracker = useRef({
        introspectCalled: false,
        refreshCalled: false
    });
    useEffect(() => {
        async function validateAndSetUser() {
            console.log("validateCall");
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
                    console.log("introspectCall")
                    console.log("introspect", response);
                    if (response) {
                        const userData = await getUser();
                        if (userData) {
                            setUser({
                                name: `${userData.username}`,
                                auth: true,
                                role: `${userData.roles[0].name}`
                            });
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
                            }
                        }
                    }
                }
            } catch (error) {
            } finally {
                setIsLoading(false);
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
    console.log("check",user.role === roleName )
    if (!user || !user.role) return false;
    return user.role === roleName;
  };

return (
    <UserContext.Provider value={{ user, loginContext, logout, loading,setIsLoading, isLoginOpen, setIsLoginOpen, hasRole}}>
        {children}
    </UserContext.Provider>
);
};
export { UserContext, UserProvider }