"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { Home, ListChecks, Dumbbell, ClipboardList, Scale, TrendingUp, Settings, LogOut, Flame, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/services/clientService";
import { ClientProfileExtended } from "@/lib/types";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { Sheet } from "@/components/ui/Sheet";

const nav = [
    { href: "/client/dashboard", label: "Home", icon: Home, exact: true },
    { href: "/client/routines", label: "My Routines", icon: ListChecks },
    { href: "/client/exercises", label: "Exercises", icon: Dumbbell },
    { href: "/client/workouts", label: "Workouts", icon: ClipboardList },
    { href: "/client/bodyweight", label: "Body Weight", icon: Scale },
    { href: "/client/progress", label: "Progress", icon: TrendingUp },
    { href: "/client/settings", label: "Settings", icon: Settings },
];

interface ClientLayoutContextType {
    client: ClientProfileExtended | null;
    refreshUser: () => Promise<void>;
}

const ClientLayoutContext = createContext<ClientLayoutContextType | undefined>(undefined);

export const useClientLayout = () => {
    const context = useContext(ClientLayoutContext);
    if (!context) throw new Error("useClientLayout must be used within ClientDashboardLayout");
    return context;
};

export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [client, setClient] = useState<ClientProfileExtended | null>(null);
    const [error, setError] = useState<string>('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (error) return <p>{error}</p>;
    if (!client) return null;

    const SidebarContent = (
        <>
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
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-sidebar-border p-3">
                <div className="flex items-center gap-3 rounded-lg p-2">
                    <ProfileImage className="border-2 border-primary" alt={client.full_name} />
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{client.full_name}</div>
                    </div>
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary hover:cursor-pointer" onClick={handleLogout} title="Sign out">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <ClientLayoutContext.Provider value={{ client, refreshUser: handleInfo }}>
        <ProtectedRoute allowedRoles={["client"]}>
            <div className="flex min-h-screen bg-background text-foreground">
                <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
                    {SidebarContent}
                </aside>

                <Sheet isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
                    <div className="flex h-full flex-col">
                        {SidebarContent}
                    </div>
                </Sheet>

                <div className="flex flex-1 flex-col lg:pl-64">
                    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl lg:px-10">
                        <button
                            className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </header>
                    <main className="flex-1 px-6 py-8 lg:px-10">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
        </ClientLayoutContext.Provider>
    );
}
