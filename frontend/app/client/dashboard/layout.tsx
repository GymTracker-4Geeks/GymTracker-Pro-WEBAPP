"use client";

import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
import { Home, ListChecks, Dumbbell, TrendingUp, User, Settings, Bell, Search, LogOut, Flame } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/services/clientService";
import { ClientProfileExtended } from "@/lib/types";

const nav = [
    { href: "/client/dashboard", label: "Inicio", icon: Home, exact: true },
    { href: "/client/routines", label: "Mis Rutinas", icon: ListChecks },
    { href: "/client/exercises", label: "Ejercicios", icon: Dumbbell },
    { href: "/client/progress", label: "Progreso", icon: TrendingUp },
    { href: "/client/profile", label: "Perfil", icon: User },
    { href: "/client/settings", label: "Configuración", icon: Settings },
];

export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [client, setClient] = useState<ClientProfileExtended | null>(null);
    const [error, setError] = useState<string>('');

    const { logoutUser } = useAuth();

    const handleInfo = async () => {
        try {
            const data = await getMe();
            setClient(data);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error has occurred.");
            }
        };
    }

    const handleLogout = () => {
        logoutUser();
    }

    useEffect(() => {
        handleInfo();
    }, []);

    if (error) return <p>{error}</p>;
    if (!client) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
                <div className="flex items-center gap-2.5 px-6 py-6">
                    <div className="grid h-9 w-9 place-items-center rounded-lg gradient-red glow-red">
                        <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="leading-tight">
                        <div className="font-display text-base font-bold">GymTracker</div>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">Pro</div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-2">
                    {nav.map((item) => {
                        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active
                                    ? "bg-primary text-primary-foreground glow-red"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-4.5 w-4.5" size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-sidebar-border p-3">
                    <div className="flex items-center gap-3 rounded-lg p-2">
                        <img
                            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&crop=faces"
                            alt="David"
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">{client.full_name}</div>
                        </div>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary hover:cursor-pointer" onClick={handleLogout} title="Cerrar sesión">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl lg:px-10">
                    <div className="relative flex-1 max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="Buscar ejercicios, rutinas..."
                            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
                        />
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground">
                            <Bell className="h-4.5 w-4.5" size={18} />
                            {/* <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-white"></span> */}
                        </button>

                    </div>
                </header>

                <main className="flex-1 px-6 py-8 lg:px-10">
                    {children}
                </main>
            </div>
        </div>
    );
}

export function PageHeader({ title, subtitle, actions }: { title: string, subtitle: string, actions?: ReactNode }) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
                {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}
