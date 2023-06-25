import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<any>('');

const UserInfor = ({children}:any)=>{
    const [user,setUser] = useState('');

    const getUser = async ()=>{
        const result:any = await AsyncStorage.getItem('idUser');
        if(result !== null){
            setUser(JSON.parse(result));
        }
        
    }

    useEffect(()=>{
        // AsyncStorage.clear()
        getUser();
    },[]);

    return(
        <UserContext.Provider value={{user,setUser,getUser}}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = ()=> useContext(UserContext);
export default UserInfor;