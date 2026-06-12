"use client";

import { useState } from 'react';

import { usarAutentificacion } from '../../../components/Autentificacion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  
  const { iniciarSesion } = usarAutentificacion();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null);

    try {
     
      const respuesta = await fetch('http://127.0.0.1:3000/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!respuesta.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const datos = await respuesta.json();
      
      
      iniciarSesion(datos.token, datos.role);

    } catch (err) {
      setError('Error al iniciar sesión. Comprueba tus datos.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <form onSubmit={handleLogin} className="bg-white p-8 w-full max-w-sm flex flex-col gap-5 border border-gray-200 rounded-xl shadow-md">
        
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-600">GymTracker Pro</h1>
          <p className="text-gray-500 mt-2 text-sm">Accede a tu cuenta</p>
        </div>

        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 text-sm font-semibold">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="entrenador@gymtracker.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 text-sm font-semibold">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 mt-2 font-bold rounded-lg shadow transition-colors w-full"
        >
          Entrar
        </button>

      </form>

    </div>
  );
}