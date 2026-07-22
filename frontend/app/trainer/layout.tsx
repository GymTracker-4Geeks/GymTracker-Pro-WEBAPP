"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect, type ReactNode, createContext, useContext } from "react";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { Sheet } from "@/components/ui/Sheet";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/lib/types";
import { getMe } from "@/services/userService";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Dumbbell,
    CalendarDays,
    Settings,
    LogOut,
    Flame,
    Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface TrainerLayoutContextType {
    user: UserProfile | null;
    refreshUser: () => Promise<void>;
}

const TrainerLayoutContext = createContext<TrainerLayoutContextType | undefined>(undefined);

export const useTrainerLayout = () => {
    const context = useContext(TrainerLayoutContext);
    if (!context) throw new Error("useTrainerLayout must be used within TrainerDashboardLayout");
    return context;
};

const primaryNav = [
    { to: "/trainer/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/trainer/clients", label: "Clients", icon: Users },
    { to: "/trainer/routines", label: "Routines", icon: ClipboardList },
    { to: "/trainer/exercises", label: "Exercises", icon: Dumbbell },
];

const operationsNav = [
    { to: "/trainer/agenda", label: "Agenda", icon: CalendarDays },
];

const bottomNav = [{ to: "/trainer/settings", label: "Settings", icon: Settings }];

function NavItem({
    to,
    label,
    icon: Icon,
    badge,
    active,
}: {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    exact?: boolean;
    badge?: string;
    active: boolean;
}) {

    return (
        <Link
            href={to}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active
                ? "bg-primary text-primary-foreground glow-red"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
        >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1 truncate">{label}</span>
            {badge && (
                <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-white/20 text-white" : "bg-accent text-foreground/80 group-hover:bg-background"
                        }`}
                >
                    {badge}
                </span>
            )}
        </Link>
    );
}

export default function TrainerDashboardLayout({ children }: { children: ReactNode }) {
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

    const isActive = (to: string, exact?: boolean) =>
        exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

    const SidebarContent = (
        <>
            <div className="flex items-center gap-2.5 px-6 py-6">
                <div className="grid h-9 w-9 place-items-center rounded-lg gradient-red glow-red">
                    <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="leading-tight">
                    <div className="font-display text-base font-bold">GymTracker</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                        Coach
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
                <div className="space-y-1">
                    <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Work Daily
                    </div>
                    {primaryNav.map((item) => (
                        <NavItem key={item.to} {...item} active={isActive(item.to, item.exact)} />
                    ))}
                </div>

                <div className="space-y-1">
                    <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Business
                    </div>
                    {operationsNav.map((item) => (
                        <NavItem key={item.to} {...item} active={isActive(item.to)} />
                    ))}
                </div>

                <div className="space-y-1">
                    <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Account
                    </div>
                    {bottomNav.map((item) => (
                        <NavItem key={item.to} {...item} active={isActive(item.to)} />
                    ))}
                </div>
            </nav>

            <div className="border-t border-sidebar-border p-3">
                <div className="flex items-center gap-3 rounded-lg p-2">
                    <ProfileImage className="border-2 border-primary" alt={user.full_name} />
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{user.full_name}</div>
                        <div className="truncate text-xs text-muted-foreground">Trainer</div>
                    </div>
                    <button
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary"
                        onClick={handleLogout}
                        title="Sign out"
                        type="button"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <TrainerLayoutContext.Provider value={{ user, refreshUser: handleInfo }}>
        <ProtectedRoute allowedRoles={["trainer"]}>
            <div className="flex min-h-screen w-full bg-background text-foreground">
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
        </ProtectedRoute >
        </TrainerLayoutContext.Provider>
    );
}

