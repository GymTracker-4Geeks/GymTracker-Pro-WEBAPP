"use client";

import Link from "next/link";
import { PageHeader } from "@/app/client/layout";
import { UnassignedClient, UserProfile } from "@/lib/types";
import { getMe } from "@/services/userService";
import {
    Users,
    CalendarCheck,
    MessageSquare,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    ChevronRight,
    Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { assignClientToMe, getMyClients, getUnassignedClients } from "@/services/trainerService";

const kpis = [
    {
        label: "Clientes activos",
        value: "24",
        delta: "+3 este mes",
        trend: "up" as const,
        icon: Users,
    },
    {
        label: "Sesiones esta semana",
        value: "42",
        delta: "8 hoy",
        trend: "up" as const,
        icon: CalendarCheck,
    },
    {
        label: "MRR",
        value: "3.480 €",
        delta: "+12,5%",
        trend: "up" as const,
        icon: CreditCard,
    },
    {
        label: "Mensajes sin leer",
        value: "7",
        delta: "−2 vs ayer",
        trend: "down" as const,
        icon: MessageSquare,
    },
];

const revenue = [
    { m: "Ene", v: 1800 },
    { m: "Feb", v: 2100 },
    { m: "Mar", v: 2400 },
    { m: "Abr", v: 2650 },
    { m: "May", v: 2980 },
    { m: "Jun", v: 3100 },
    { m: "Jul", v: 3480 },
];

const upcoming = [
    { time: "09:00", client: "Lucía Martín", type: "Sesión 1-a-1", color: "bg-primary" },
    { time: "10:30", client: "Iván Romero", type: "Revisión plan", color: "bg-emerald-500" },
    { time: "12:00", client: "Sara López", type: "Sesión 1-a-1", color: "bg-primary" },
    { time: "17:00", client: "Marc Puig", type: "Onboarding", color: "bg-amber-500" },
    { time: "18:30", client: "Noa García", type: "Sesión 1-a-1", color: "bg-primary" },
];

const recent = [
    {
        name: "Lucía Martín",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
        text: "Completó sesión de Pierna · 12.450 kg de volumen",
        time: "Hace 18 min",
    },
    {
        name: "Iván Romero",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
        text: "Subió 3 fotos de progreso",
        time: "Hace 1 h",
    },
    {
        name: "Sara López",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
        text: "Nueva marca: sentadilla 80 kg x 5",
        time: "Hace 2 h",
    },
    {
        name: "Marc Puig",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
        text: "Renovó plan Premium (3 meses)",
        time: "Ayer",
    },
];

export default function DashboardPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');
    const [clients, setClients] = useState<any[]>([]); 

    // 1. Flujo interactivo para asignarse un cliente independiente
    const handleAssignClientFlow = async () => {
        try {
            const availableClients: UnassignedClient[] = await getUnassignedClients();

            if (availableClients.length === 0) {
                alert("There are no unassigned clients available at this moment.");
                return;
            }

            const promptMessage = "Available independent clients:\n\n" +
                availableClients.map((c) => `[ID: ${c.id}] - ${c.full_name} (${c.email ?? "No email"})`).join("\n") +
                "\n\nEnter the ID of the client you want to assign to your profile:";

            const targetIdInput = prompt(promptMessage);
            if (!targetIdInput) return;

            const targetClientId = parseInt(targetIdInput);
            if (isNaN(targetClientId) || !availableClients.some((c) => c.id === targetClientId)) {
                alert("Invalid Client ID selection. Please try again.");
                return;
            }

            await assignClientToMe(targetClientId);

            alert("Success! The client is now linked to your GymForge account.");
            window.location.reload();

        } catch (error: any) {
            console.error("Error during client assignment flow:", error);
            alert(error.message || "An error occurred while connecting to the server.");
        }
    };

    // 2. Traer el listado de tus clientes vinculados en MySQL
    const fetchTrainerClients = async () => {
        try {
            const data = await getMyClients();
            if (data && data.length > 0) {
                setClients(data);
            } else {
                console.log("Aún no tienes clientes asignados a tu cuenta de entrenador.");
            }
        } catch (err) {
            console.error("Error obteniendo listado de tus clientes asignados:", err);
        }
    };

    // 3. Obtener la información de tu perfil logueado
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
        }
    };

    // 4. Efecto de montaje controlado
    useEffect(() => {
        handleInfo();
        fetchTrainerClients();
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return null;

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title={`Hi ${user.full_name}!👋`}
                subtitle="This is what is happening with your clients today."
                actions={
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={handleAssignClientFlow}
                            className="inline-flex items-center gap-2 gradient-red glow-red px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 hover:cursor-pointer"
                        >
                            <Plus className="h-4 w-4" /> New Client
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((k) => (
                    <div
                        key={k.label}
                        className="card-hover rounded-2xl border border-border bg-card p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                <k.icon className="h-5 w-5" />
                            </div>
                            <span
                                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${k.trend === "up"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-rose-500/10 text-rose-400"
                                    }`}
                            >
                                {k.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                )}
                                {k.delta}
                            </span>
                        </div>
                        <div className="mt-4 text-3xl font-bold tracking-tight">{k.value}</div>
                        <div className="text-xs text-muted-foreground">{k.label}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Ingresos recurrentes</h3>
                            <p className="text-xs text-muted-foreground">Últimos 7 meses (MRR)</p>
                        </div>
                        <button type="button" className="text-sm font-medium text-primary hover:underline">
                            Ver pagos
                        </button>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenue} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.45} />
                                        <stop offset="100%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="oklch(0.24 0.008 270)" vertical={false} />
                                <XAxis
                                    dataKey="m"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "oklch(0.68 0.01 270)", fontSize: 12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "oklch(0.68 0.01 270)", fontSize: 12 }}
                                    tickFormatter={(v) => `${v}€`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "oklch(0.18 0.006 270)",
                                        border: "1px solid oklch(0.26 0.008 270)",
                                        borderRadius: 8,
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke="oklch(0.62 0.22 25)"
                                    strokeWidth={2.5}
                                    fill="url(#g1)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Agenda de hoy</h3>
                            <p className="text-xs text-muted-foreground">5 sesiones programadas</p>
                        </div>
                        <Link href="/agenda" className="text-sm font-medium text-primary hover:underline">
                            Ver agenda
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {upcoming.map((u) => (
                            <div
                                key={u.time}
                                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                            >
                                <div className="flex w-14 flex-col items-center">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="mt-1 text-sm font-semibold">{u.time}</span>
                                </div>
                                <div className={`h-10 w-1 rounded-full ${u.color}`} />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium">{u.client}</div>
                                    <div className="text-xs text-muted-foreground">{u.type}</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Actividad */}
            <section className="mt-8 rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Actividad de tus clientes</h3>
                        <p className="text-xs text-muted-foreground">Las últimas acciones registradas</p>
                    </div>
                    <Link href="/clientes" className="text-sm font-medium text-primary hover:underline">
                        Ver todos
                    </Link>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    {recent.map((r) => (
                        <div
                            key={r.name}
                            className="card-hover flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                        >
                            <img src={r.img} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold">{r.name}</div>
                                <div className="truncate text-xs text-muted-foreground">{r.text}</div>
                            </div>
                            <span className="text-[11px] text-muted-foreground">{r.time}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
