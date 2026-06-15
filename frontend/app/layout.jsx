import { Autentificador } from '../components/Autentificacion';
import './globals.css'; 

export const metadata = {
  title: 'GymTracker Pro',
  description: 'Plataforma integral de gestión para entrenadores y clientes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-full flex flex-col">
        <ProveedorAutentificador>
          {children}
        </ProveedorAutentificador>
      </body>
    </html>
  );
}