"use client";

import { useEffect, useMemo, useState } from "react";
import { usarAutentificacion } from "@/context/AuthContext";
import {
    AlertCircle,
    Bell,
    CalendarDays,
    ChevronRight,
    CreditCard,
    Dumbbell,
    Flame,
    LayoutGrid,
    Loader2,
    LogOut,
    MessageSquare,
    Plus,
    Search,
    Settings,
    Users,
    WalletCards,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api";

const navGroups = [
    {
        title: "Trabajo diario",
        items: [
            { label: "Dashboard", icon: LayoutGrid, href: "/trainer/dashboard", active: true },
            { label: "Clientes", icon: Users, href: "/trainer/clients" },
            { label: "Rutinas", icon: WalletCards, href: "/trainer/routines" },
            { label: "Ejercicios", icon: Dumbbell, href: "/trainer/exercises" },
        ],
    },
    {
        title: "Negocio",
        items: [
            { label: "Agenda", icon: CalendarDays, href: "#" },
            { label: "Mensajes", icon: MessageSquare, href: "#" },
            { label: "Pagos", icon: CreditCard, href: "#" },
        ],
    },
    {
        title: "Cuenta",
        items: [{ label: "Configuracion", icon: Settings, href: "/settings" }],
    },
];

const schedule = [
    { time: "09:00", name: "Pendiente endpoint", type: "Agenda mock", color: "bg-rose-500" },
    { time: "10:30", name: "Pendiente endpoint", type: "Agenda mock", color: "bg-emerald-500" },
    { time: "12:00", name: "Pendiente endpoint", type: "Agenda mock", color: "bg-rose-500" },
];

const chartPoints = "0,162 110,146 220,126 330,106 440,88 550,72 660,56 770,34";
const chartArea = `${chartPoints} 770,230 0,230`;

function SidebarItem({ item }) {
    const Icon = item.icon;

    return (
        <a
            className={`flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition ${
                item.active
                    ? "bg-[#f52c3c] text-white shadow-[0_18px_45px_rgba(245,44,60,0.34)]"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
            }`}
            href={item.href}
        >
            <span className="flex items-center gap-3">
                <Icon size={18} strokeWidth={2} />
                {item.label}
            </span>
        </a>
    );
}

function getClientName(client) {
    return client.full_name || client.email || `Cliente #${client.id}`;
}

function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function TrainerDashboardPage() {
    const { cerrarSesion } = usarAutentificacion();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(`${API_URL}/trainers/clients`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    cerrarSesion();
                    return;
                }

                if (!response.ok) {
                    throw new Error("No se pudo cargar el dashboard");
                }

                const data = await response.json();
                setClients(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [cerrarSesion]);

    const dashboard = useMemo(() => {
        const routineIds = new Set();
        const clientsWithRoutine = clients.filter((client) => {
            client.routine_ids?.forEach((routineId) => routineIds.add(routineId));
            return client.routine_ids?.length > 0;
        }).length;

        return {
            totalClients: clients.length,
            clientsWithRoutine,
            clientsWithoutRoutine: clients.length - clientsWithRoutine,
            uniqueRoutines: routineIds.size,
            recentClients: clients.slice(0, 5),
        };
    }, [clients]);

    const metrics = [
        {
            label: "Clientes activos",
            value: dashboard.totalClients,
            trend: "Backend",
            icon: Users,
            tone: "positive",
        },
        {
            label: "Clientes con rutina",
            value: dashboard.clientsWithRoutine,
            trend: "Asignados",
            icon: Dumbbell,
            tone: "positive",
        },
        {
            label: "Rutinas usadas",
            value: dashboard.uniqueRoutines,
            trend: "Unicas",
            icon: WalletCards,
            tone: "positive",
        },
        {
            label: "Sin rutina",
            value: dashboard.clientsWithoutRoutine,
            trend: "Pendiente",
            icon: AlertCircle,
            tone: "negative",
        },
    ];

    return (
        <main className="min-h-screen bg-[#07080a] text-white">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-white/[0.08] bg-[#090a0c] lg:flex lg:flex-col">
                <div className="flex h-20 items-center gap-3 px-5">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ef2336] shadow-[0_16px_34px_rgba(239,35,54,0.35)]">
                        <Flame size={21} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-base font-bold leading-5">GymTracker</p>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ef2336]">
                            Coach
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-7 px-4 py-3">
                    {navGroups.map((group) => (
                        <section key={group.title}>
                            <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                                {group.title}
                            </p>
                            <div className="space-y-1.5">
                                {group.items.map((item) => (
                                    <SidebarItem item={item} key={item.label} />
                                ))}
                            </div>
                        </section>
                    ))}
                </nav>

                <div className="border-t border-white/[0.08] p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-[#f6e4d2] to-[#7c1d1d] text-sm font-black text-white">
                            TR
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">Trainer</p>
                            <p className="truncate text-xs text-zinc-500">Entrenador - Pro</p>
                        </div>
                        <button
                            aria-label="Cerrar sesion"
                            className="grid h-9 w-9 place-items-center rounded-xl text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                            onClick={cerrarSesion}
                            type="button"
                        >
                            <LogOut size={17} />
                        </button>
                    </div>
                </div>
            </aside>

            <section className="min-h-screen lg:pl-[270px]">
                <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-xl">
                    <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:px-10">
                        <label className="relative hidden w-full max-w-[485px] md:block">
                            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={19} />
                            <input
                                className="h-11 w-full rounded-2xl border border-white/[0.09] bg-[#111216] pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-[#ef2336]/70 focus:ring-4 focus:ring-[#ef2336]/10"
                                placeholder="Buscar cliente, rutina, ejercicio..."
                            />
                        </label>

                        <div className="ml-auto flex items-center gap-3">
                            <a className="hidden h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#121318] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#181a20] sm:inline-flex" href="/trainer/clients">
                                <Plus size={16} className="text-[#ef2336]" />
                                Nuevo cliente
                            </a>
                            <button aria-label="Notificaciones" className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.08] bg-[#121318] text-zinc-300 hover:bg-[#181a20]">
                                <Bell size={17} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 xl:px-10">
                    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                                Hola Trainer
                            </h1>
                            <p className="mt-3 text-base text-zinc-400">
                                Datos reales de tus clientes desde el backend.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <a className="h-12 rounded-2xl border border-white/[0.09] bg-[#121318] px-5 py-3 text-sm font-bold text-white hover:bg-[#181a20]" href="/trainer/clients">
                                Ver clientes
                            </a>
                            <a className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#ef2336] px-5 text-sm font-black text-white shadow-[0_18px_42px_rgba(239,35,54,0.38)] hover:bg-[#ff3144]" href="/trainer/clients">
                                <Plus size={18} />
                                Nuevo cliente
                            </a>
                        </div>
                    </section>

                    {loading ? (
                        <div className="mt-8 flex min-h-[260px] items-center justify-center gap-3 rounded-[24px] border border-white/[0.08] bg-[#121318] text-zinc-400">
                            <Loader2 className="h-5 w-5 animate-spin text-[#ef2336]" />
                            Cargando dashboard...
                        </div>
                    ) : error ? (
                        <div className="mt-8 flex min-h-[160px] items-center justify-center gap-3 rounded-[24px] border border-rose-500/30 bg-[#121318] text-rose-400">
                            <AlertCircle className="h-5 w-5" />
                            {error}
                        </div>
                    ) : (
                        <>
                            <section className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                                {metrics.map((metric) => {
                                    const Icon = metric.icon;
                                    const isPositive = metric.tone === "positive";

                                    return (
                                        <article className="rounded-[22px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" key={metric.label}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ef2336]/10 text-[#ef2336]">
                                                    <Icon size={22} />
                                                </div>
                                                <span className={`rounded-full px-3 py-1 text-xs font-black ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                                    {metric.trend}
                                                </span>
                                            </div>
                                            <p className="mt-7 text-4xl font-black tracking-tight">{metric.value}</p>
                                            <p className="mt-1 text-sm text-zinc-500">{metric.label}</p>
                                        </article>
                                    );
                                })}
                            </section>

                            <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.9fr)]">
                                <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-black">Clientes recientes</h2>
                                            <p className="mt-1 text-sm text-zinc-500">Primeros clientes devueltos por /api/trainers/clients</p>
                                        </div>
                                        <a className="text-sm font-black text-[#ef3345] hover:text-[#ff5260]" href="/trainer/clients">
                                            Ver todos
                                        </a>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        {dashboard.recentClients.length ? dashboard.recentClients.map((client) => {
                                            const name = getClientName(client);

                                            return (
                                                <a className="group flex min-h-[68px] items-center gap-4 rounded-[18px] border border-white/[0.07] bg-[#090a0c] px-4 transition hover:border-[#ef2336]/45 hover:bg-[#0d0e11]" href={`/trainer/clients`} key={client.id}>
                                                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ef2336]/15 text-sm font-black text-[#ff5260]">
                                                        {getInitials(name)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-black">{name}</p>
                                                        <p className="mt-1 truncate text-sm text-zinc-500">
                                                            {client.routine_ids?.length || 0} rutinas asignadas
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="text-zinc-600 transition group-hover:text-white" size={19} />
                                                </a>
                                            );
                                        }) : (
                                            <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center text-sm text-zinc-500">
                                                Todavia no tienes clientes asignados.
                                            </div>
                                        )}
                                    </div>
                                </article>

                                <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-black">Agenda de hoy</h2>
                                            <p className="mt-1 text-sm text-zinc-500">Mock visual hasta que exista endpoint</p>
                                        </div>
                                        <a className="text-sm font-black text-[#ef3345] hover:text-[#ff5260]" href="#">
                                            Ver agenda
                                        </a>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        {schedule.map((session) => (
                                            <a className="group flex min-h-[68px] items-center gap-4 rounded-[18px] border border-white/[0.07] bg-[#090a0c] px-4 transition hover:border-[#ef2336]/45 hover:bg-[#0d0e11]" href="#" key={`${session.time}-${session.name}`}>
                                                <div className="w-14 shrink-0">
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <CalendarDays size={12} />
                                                    </div>
                                                    <p className="mt-1 text-base font-black">{session.time}</p>
                                                </div>
                                                <span className={`h-10 w-1 rounded-full ${session.color}`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-black">{session.name}</p>
                                                    <p className="mt-1 truncate text-sm text-zinc-500">{session.type}</p>
                                                </div>
                                                <ChevronRight className="text-zinc-600 transition group-hover:text-white" size={19} />
                                            </a>
                                        ))}
                                    </div>
                                </article>
                            </section>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
