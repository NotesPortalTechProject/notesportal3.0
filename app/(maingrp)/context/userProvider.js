"use client"
import { createContext, useContext } from "react"

const userContext = createContext(null);

export default function UserProvider({ user, children }) {
    return (
        <userContext.Provider value={user}>
            {children}
        </userContext.Provider>
    );
}

export function useUser() {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("User context unavailable");
    }
    return context;
}

export function getUserIdContext(){
    const context = useContext(userContext);
    if(!context){
        throw new Error("User context unavailable");
    }
    return context.userId;
}