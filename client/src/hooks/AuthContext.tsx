import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
    logout: () => void;
    status: 'loading' | 'authenticated' | 'unauthenticated';
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    const hydrateWithToken = () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setUser(null);
            setStatus('unauthenticated');
            return;
        }
        try {
            const decodedUser = jwtDecode(token);
            const time = Math.floor(Date.now() / 1000);
            if (decodedUser?.exp && decodedUser?.exp <= time) {
                localStorage.removeItem('accessToken');
                setUser(null);
                setStatus('unauthenticated');
            } else {
                setUser(decodedUser);
                setStatus('authenticated');
            }
        } catch {
            console.log('error authenticating user, force relog');
            localStorage.removeItem('accessToken');
            setUser(null);
            setStatus('unauthenticated');
        }
    };

    useEffect(() => {
        // Hydrate token initially upon application load
        hydrateWithToken();

        const onStorage = (e: StorageEvent) => {
            // if the storage change wasn't in localStorage, return
            if (e.storageArea !== localStorage) return;

            // If the access token didn't change, return
            if (e.key !== 'accessToken' && e.key !== null) return;

            hydrateWithToken(); // hydrate token on update
        };
        // Across tab/window/iframe event tracker for storage changes. This will sync logins/logouts on the fly
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setStatus('unauthenticated');
    };

    const value = useMemo(() => ({ user, setUser, logout, status }), [user, status]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
