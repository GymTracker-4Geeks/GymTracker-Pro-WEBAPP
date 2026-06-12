"use client";

import { usarAutentificacion } from '../../../components/Autentificacion';

export default function DashboardEntrenador() {
  const { cerrarSesion } = usarAutentificacion();

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-blue-400">GymTracker Pro</h2>
          <nav className="flex flex-col gap-4">
            {/* Aquí en el futuro usaremos el componente <Link> de Next.js */}
            <a href="/trainer/dashboard" className="font-semibold text-white bg-gray-800 p-2 rounded">
              Inicio
            </a>
            <a href="/trainer/clients" className="font-medium text-gray-400 hover:text-white p-2 transition-colors">
              Mis Clientes
            </a>
            <a href="/trainer/routines" className="font-medium text-gray-400 hover:text-white p-2 transition-colors">
              Gestión de Rutinas
            </a>
          </nav>
        </div>
        
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      
      <div className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Panel General</h1>
          <p className="text-gray-500 mt-1">Bienvenido de nuevo, Entrenador.</p>
        </header>
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">
              Clientes Activos
            </div>
            <div className="text-4xl font-bold text-blue-600">12</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">
              Rutinas Creadas
            </div>
            <div className="text-4xl font-bold text-green-600">8</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">
              Pendientes de Revisión
            </div>
            <div className="text-4xl font-bold text-orange-500">3</div>
          </div>

        </div>
      </div>

    </div>
  );
}
