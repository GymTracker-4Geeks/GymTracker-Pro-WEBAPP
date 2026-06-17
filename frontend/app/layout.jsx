import { ProveedorAutentificacion } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
    title: "GymTracker Pro",
    description: "Plataforma de Gestión para entrenadores y clientes",
};

export default function AppLayout({ children }) {
    return (
        <html lang="es">
            <body className="min-h-full flex flex-col">
                <ProveedorAutentificacion>
                    {children}
                </ProveedorAutentificacion>
            </body>
        </html>
    );
}