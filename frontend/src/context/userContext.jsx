import { createContext, useEffect, useState } from "react";

import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    //auto fetch if jwt cookies exist
    useEffect(()=>{
        const fetchUser = async() => {
            try {
                const res = await axios.get("http://localhost:3000/api/v1/auth/profile",{
                    withCredentials: true
                })
                setUser(res.data);
            } catch(err) {
                setUser(null);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    },[])

    return (
        <UserContext.Provider value={ {user, setUser,loading} }>
            {children}
        </UserContext.Provider>
    )
};
