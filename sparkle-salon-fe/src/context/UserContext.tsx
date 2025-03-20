import React, { useEffect, useRef, useState } from 'react'
import { introspect, getUser, refresh } from '../data/authData';
import { toast } from 'react-toastify';
const UserContext = React.createContext({ name: '', auth: false });

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState({ name: '', auth: false });
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
                                auth: true
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
                                        auth: true
                                    });
                                }
                            } else {
                                logout();
                            }
                        }
                    }
                }
                // const response = await introspect();
                // console.log("introspect", response);
                // // If token is not valid, try to refresh
                // if (response) {
                //     // If token is valid, get user data directly
                //     const userData = await getUser();

                //     if (userData) {
                //         setUser({
                //             name: `${userData.username}`,
                //             auth: true
                //         });
                //     }
                // }else{
                //     const refreshResponse = await refresh();
                //     console.log("refresh", refreshResponse)
                //     if (refreshResponse?.token) {
                //         localStorage.setItem("token", refreshResponse.token);
                //         console.log("set Success full");
                //         // After refreshing token, we need to get user data
                //         const userData = await getUser();
    
                //         if (userData) {
                //             setUser({
                //                 name: `${userData.username}`,
                //                 auth: true
                //             });
                //         }
                //     } else {
                //         // If refresh fails, clear token and set auth to false
                //         localStorage.removeItem("token");
                //         setUser({
                //             name: "",
                //             auth: false
                //         });
                //         toast.error("Your access is expired");
                //         setTimeout(() => { logout(); }, 1000);
                //     }
                // }
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
    const loginContext = (name) => {
        setUser((user) => ({
            name: name,
            auth: true
        }))

    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser((user) => ({
            name: '',
            auth: false
        }))
        setIsLoginOpen(true);
    }
    return (
        <UserContext.Provider value={{ user, loginContext, logout, loading, isLoginOpen, setIsLoginOpen }}>
            {children}
        </UserContext.Provider>
    );
};
export { UserContext, UserProvider }
