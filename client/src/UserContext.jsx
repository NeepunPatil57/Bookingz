import {createContext,useState,useEffect} from 'react';
import axios from 'axios';
export const UserContext=createContext({});
export function UserContextProvider({children}){
    const [user,setUser]=useState(null);
    useEffect(()=>{
        if(!user){
            axios.get('http://localhost:4000/profile').then(({data})=>{
                setUser(data);
            })
        }
    },[])

    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    );
}