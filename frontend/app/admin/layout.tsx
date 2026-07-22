"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect, ReactNode, useContext, createContext } from "react";
import { Home, User, LogOut, Flame, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/lib/types";
import { getMe } from "@/services/userService";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

interface AdminLayoutContextType {
    user: UserProfile | null;
    refreshUser: () => Promise<void>;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export const useAdminLayout = () => {
    const context = useContext(AdminLayoutContext);
    if (!context) throw new Error("useAdminLayout must be used within AdminDashboardLayout");
    return context;
};

const nav = [
    { href: "/admin/dashboard", label: "Home", icon: Home, exact: true },
    { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { logoutUser } = useAuth();

    const handleInfo = async () => {
        try {
            const data = await getMe();
            setUser(data);
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
    if (!user) return null;

    const SidebarContent = (
        <>
            <div className="flex items-center gap-2.5 px-6 py-6">
                <div className="grid h-9 w-9 place-items-center rounded-lg gradient-red glow-red">
                    <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="leading-tight">
                    <div className="font-display text-base font-bold">GymTracker</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">Administrator</div>
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
                    <ProfileImage className="border-2 border-primary" alt={user.full_name} />
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{user.full_name}</div>
                    </div>
                    <Button className="bg-gray rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary hover:cursor-pointer" onClick={handleLogout} title="Logout">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <AdminLayoutContext.Provider value={{ user, refreshUser: handleInfo }}>
            <ProtectedRoute allowedRoles={["admin"]}>
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
        </AdminLayoutContext.Provider >
    );
}
