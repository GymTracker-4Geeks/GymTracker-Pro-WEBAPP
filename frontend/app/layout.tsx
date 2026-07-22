import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { ReactNode } from "react";

export const metadata : { title : string; description : string } = {
    title: "GymTracker Pro",
    description: "Management Platform for trainers and clients",
};

export default function AppLayout({ children } : { children: ReactNode}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}