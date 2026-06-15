
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ContextoAutentificacion = createContext();

export function ProveedorAutentificacion({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
    setLoading(false); 
  }, []);

  const iniciarSesion = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
    
    if (newRole === 'trainer') {
      router.push('/trainer/dashboard');
    } else {
      router.push('/client/dashboard');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    router.push('/auth/login');
  };

  return (
    <ContextoAutentificacion.Provider value={{ token, role, iniciarSesion, cerrarSesion, loading }}>
      {!loading && children} 
    </ContextoAutentificacion.Provider>
  );
}


export const usarAutentificacion = () => useContext(ContextoAutentificacion);