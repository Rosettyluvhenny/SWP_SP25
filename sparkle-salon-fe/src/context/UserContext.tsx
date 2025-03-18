import React, { useEffect, useState } from 'react'
import { introspect, getUser } from '../data/authData';
const UserContext = React.createContext({name: '', auth: false});

const UserProvider= ({children}) => {
    const [user, setUser] = React.useState({name:'', auth:false});
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        async function validateAndSetUser(){
            setIsLoading(true);

            const token = localStorage.getItem("token");
            console.log("loading", loading);
            if(!token){
                setIsLoading(false);
                return
            }
            
            try{
                const response = await introspect();
                console.log("response",response);
                if(!response){
                    setIsLoading(false);
                    return
                }
                
                    const userData = await getUser();
                    if(userData){
                             setUser((user)=>({
                            name: `${userData.username}`,
                            auth: true
                        }));
                    }
            }catch{

            }finally{
                setIsLoading(false);
            }
        }
        validateAndSetUser();
    },[])
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