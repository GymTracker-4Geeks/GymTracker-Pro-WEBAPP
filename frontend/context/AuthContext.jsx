"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ContextoAutentificacion = createContext();

export function ProveedorAutentificacion({ children }) {
    const [access_token, setAccessToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const iniciarSesion = (newToken, newRole) => {
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('role', newRole);
        setAccessToken(newToken);
        setRole(newRole);

        if (newRole === 'trainer') {
            router.push('/trainer/dashboard');
        } else {
            router.push('/client/dashboard');
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        setAccessToken(null);
        setRole(null);
        router.push('/auth/login');
    };

    return (
        <ContextoAutentificacion.Provider value={{ access_token, role, iniciarSesion, cerrarSesion, loading }}>
            {!loading && children}
        </ContextoAutentificacion.Provider>
    );
}


export const usarAutentificacion = () => useContext(ContextoAutentificacion);