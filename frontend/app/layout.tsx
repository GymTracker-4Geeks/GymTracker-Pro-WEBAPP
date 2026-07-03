import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { ReactNode } from "react";

export const metadata : { title : string; description : string } = {
    title: "GymTracker Pro",
    description: "Plataforma de Gestión para entrenadores y clientes",
};

export default function AppLayout({ children } : { children: ReactNode}) {
    return (
        <html lang="es">
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}