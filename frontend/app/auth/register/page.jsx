"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError(null);
    setSuccess(false);

    try {
      const respuesta = await fetch('http://127.0.0.1:5000/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ name, email, password, role }), 
      });

      if (!respuesta.ok) {
        throw new Error('Error al crear la cuenta');
      }

      setSuccess(true);
      
     
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err) {
      setError('Hubo un problema al registrarte. Verifica los datos o intenta con otro correo.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <form onSubmit={handleRegister} className="bg-white p-8 w-full max-w-sm flex flex-col gap-4 border border-gray-200 rounded-xl shadow-md">
        
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-600">GymTracker Pro</h1>
          <p className="text-gray-500 mt-2 text-sm">Crea una cuenta nueva</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 text-sm">
            ¡Cuenta creada con éxito! Redirigiendo al login...
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 text-sm font-semibold">Nombre completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 text-sm font-semibold">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="tu@email.com"
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
            minLength={6}
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label className="text-gray-700 text-sm font-semibold">¿Qué eres?</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
          >
            <option value="client">Cliente</option>
            <option value="trainer">Entrenador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={success}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3 font-bold rounded-lg shadow transition-colors w-full"
        >
          Registrarse
        </button>

        <div className="text-center mt-2 text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" className="text-blue-600 font-semibold hover:underline">
            Inicia sesión
          </a>
        </div>

      </form>

    </div>
  );
}