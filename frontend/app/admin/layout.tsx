"use client";

import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
import { Home, User, Settings, LogOut, Flame } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/lib/types";
import { getMe } from "@/services/userService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { Button } from "@/components/ui/Button";

const nav = [
    { href: "/admin/dashboard", label: "Home", icon: Home, exact: true },
    { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');

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

    if (error) return <p>{error}</p>;
    if (!user) return null;

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="flex min-h-screen bg-background text-foreground">
                <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
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
                                    <Icon className="h-4.5 w-4.5" size={18} />
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
                </aside>

                <div className="flex flex-1 flex-col lg:pl-64">
                    <main className="flex-1 px-6 py-8 lg:px-10">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
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
