import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};
