"use client";

import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecovery = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const respuesta = await fetch('http://127.0.0.1:8000/v1/recovery-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo procesar la solicitud.');
      }

     
      setMessage('Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña en unos minutos.');
      setEmail(''); 

    } catch (err) {
      setError('Hubo un problema de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <form onSubmit={handleRecovery} className="bg-white p-8 w-full max-w-sm flex flex-col gap-5 border border-gray-200 rounded-xl shadow-md">
        
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-600">GymTracker Pro</h1>
          <p className="text-gray-500 mt-2 text-sm">Recupera tu acceso</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 text-sm">
            {message}
          </div>
        )}

      
        <div className="text-sm text-gray-600 text-center px-2">
          Introduce tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <label className="text-gray-700 text-sm font-semibold">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="tu@email.com"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3 font-bold rounded-lg shadow transition-colors w-full mt-2"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          ¿Recordaste tu contraseña?{' '}
          <a href="/auth/login" className="text-blue-600 font-semibold hover:underline">
            Vuelve al Login
          </a>
        </div>

      </form>

    </div>
  );
}