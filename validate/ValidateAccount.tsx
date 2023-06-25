import React from "react";

export const ValidateAccount = ()=>{
    const checkEmailNull = (email:string)=>{
        let check:boolean;
        if(email === ''){
            check = true;
            return check;
        }
        else{
            check = false;
            return check;
        }
    }
}