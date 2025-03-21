import React, { useEffect, useRef, useState } from 'react'
import { introspect, getUser, refresh } from '../data/authData';
import { toast } from 'react-toastify';
const UserContext = React.createContext({ name: '', auth: false, role:'' });

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState({ name: '', auth: false, role:''});
    const [loading, setIsLoading] = useState(true);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

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
                                if (userData) {
                                    setUser({
                                        name: `${userData.username}`,
                                        auth: true,
                                        role: ''
                                    });
                                }
                            } else {
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
                console.log("token", localStorage.getItem("token"));
            }
        }

        validateAndSetUser();
    }, []);
    const loginContext =  (name, role) => {
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
    
    const hasRole = (user, roleName:string) => {
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
