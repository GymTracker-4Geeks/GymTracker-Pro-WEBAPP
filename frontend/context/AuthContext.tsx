"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    access_token: string | null;
    role: string | null;
    loading: boolean;
    loginUser: (newToken: string, newRole: string) => void;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [access_token, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedRole = localStorage.getItem('role');

        if (storedToken && storedRole) {
            setAccessToken(storedToken);
            setRole(storedRole);
        }
        setLoading(false);
    }, []);

    const loginUser = (newToken: string, newRole: string) => {
        const normalizedRole = newRole.toLowerCase().trim();

        localStorage.setItem('access_token', newToken);
        localStorage.setItem('role', normalizedRole);
        setAccessToken(newToken);
        setRole(normalizedRole);

        if (normalizedRole === 'trainer') {
            router.replace('/trainer/dashboard');
        } else if (normalizedRole === 'client') {
            router.replace('/client/dashboard');
        } else if (normalizedRole === 'admin') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/auth/login');
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        setAccessToken(null);
        setRole(null);
        router.replace('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ access_token, role, loginUser, logoutUser, loading }}>
            {loading ? <div className="flex h-screen items-center justify-center">Loading...</div> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};