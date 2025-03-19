import React, { useEffect, useState } from 'react'
import { introspect, getUser, refresh } from '../data/authData';
import { toast } from 'react-toastify';
const UserContext = React.createContext({name: '', auth: false});

const UserProvider= ({children}) => {
    const [user, setUser] = React.useState({name:'', auth:false});
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        async function validateAndSetUser() {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsLoading(false);
                return;
            }
            
            try {
                // Check if current token is valid
                const response = await introspect();
                
                // If token is not valid, try to refresh
                if (!response) {
                    const refreshResponse = await refresh();
                    
                    if (refreshResponse?.token) {
                        localStorage.setItem("token", refreshResponse.token);
                        // After refreshing token, we need to get user data
                        const userData = await getUser();
                        
                        if (userData) {
                            setUser({
                                name: `${userData.username}`,
                                auth: true
                            });
                        }
                    } else {
                        // If refresh fails, clear token and set auth to false
                        localStorage.removeItem("token");
                        setUser({
                            name: "",
                            auth: false
                        });
                    }
                } else {
                    // If token is valid, get user data directly
                    const userData = await getUser();
                    
                    if (userData) {
                        setUser({
                            name: `${userData.username}`,
                            auth: true
                        });
                    }
                }
            } catch (error) {
                toast.error("Your access is expired");
                // Handle error by clearing token and setting auth to false
                logout();
            } finally {
                setIsLoading(false);
            }
        }
        
        validateAndSetUser();
    }, []);
    const loginContext = (name) =>{
        setUser((user)=>({
            name: name,
            auth: true
        }))
        
    };
    
    const logout = ()=>{
        localStorage.removeItem("token");
        setUser((user)=> ({
            name:'',
            auth:false
        }))
    }
    return (
        <UserContext.Provider value={{user, loginContext, logout, loading}}>
            {children}
        </UserContext.Provider>
    );
};
export {UserContext, UserProvider}