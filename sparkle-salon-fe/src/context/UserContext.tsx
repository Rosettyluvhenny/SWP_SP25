import React from 'react'

const UserContext = React.createContext({name: '', auth: false});

const UserProvider= ({children}) => {
    const [user, setUser] = React.useState({name:'', auth:false});

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
        <UserContext.Provider value={{user, loginContext, logout}}>
            {children}
        </UserContext.Provider>
    );
};
export {UserContext, UserProvider}