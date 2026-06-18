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
    Filter,
    Flame,
    LayoutGrid,
    Loader2,
    LogOut,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    SlidersHorizontal,
    UserPlus,
    Users,
    WalletCards,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api";

const navGroups = [
    {
        title: "Trabajo diario",
        items: [
            { label: "Dashboard", icon: LayoutGrid, href: "/trainer/dashboard" },
            { label: "Clientes", icon: Users, href: "/trainer/clients", active: true },
            { label: "Rutinas", icon: WalletCards, href: "/trainer/routines" },
            { label: "Ejercicios", icon: Dumbbell, href: "/trainer/exercises" },
        ],
    },
    {
        title: "Negocio",
        items: [
            { label: "Agenda", icon: CalendarDays, href: "#" },
            { label: "Pagos", icon: CreditCard, href: "#" },
        ],
    },
    {
        title: "Cuenta",
        items: [{ label: "Configuracion", icon: Settings, href: "/settings" }],
    },
];

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

function StatusBadge({ client }) {
    const hasRoutine = client.routine_ids?.length > 0;

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
                hasRoutine
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-300"
            }`}
        >
            {hasRoutine ? "Activo" : "Sin rutina"}
        </span>
    );
}

export default function TrainerClientsPage() {
    const { cerrarSesion } = usarAutentificacion();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
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
                    throw new Error("No se pudieron cargar los clientes");
                }

                const data = await response.json();
                setClients(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [cerrarSesion]);

    const summary = useMemo(() => {
        const withRoutine = clients.filter((client) => client.routine_ids?.length > 0).length;
        const withoutRoutine = clients.length - withRoutine;
        const withHeight = clients.filter((client) => client.height).length;

        return [
            { label: "Clientes activos", value: clients.length, detail: "Asignados" },
            { label: "Con rutina", value: withRoutine, detail: "Listos" },
            { label: "Sin rutina", value: withoutRoutine, detail: "Pendientes" },
            { label: "Con altura", value: withHeight, detail: "Perfil completo" },
        ];
    }, [clients]);

    const selectedClient = clients[0];

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
                        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-[#f6e4d2] to-[#7c1d1d] text-sm font-black">
                            CV
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
                            <button className="hidden h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#121318] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#181a20] sm:inline-flex">
                                <Plus size={16} className="text-[#ef2336]" />
                                Nuevo cliente
                            </button>
                            <button
                                aria-label="Notificaciones"
                                className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.08] bg-[#121318] text-zinc-300 hover:bg-[#181a20]"
                            >
                                <Bell size={17} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 xl:px-10">
                    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ef2336]">
                                Clientes
                            </p>
                            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                                Gestion de clientes
                            </h1>
                            <p className="mt-3 max-w-2xl text-base text-zinc-400">
                                Clientes reales asignados al entrenador autenticado.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/[0.09] bg-[#121318] px-5 text-sm font-bold hover:bg-[#181a20]">
                                <SlidersHorizontal size={18} />
                                Filtros
                            </button>
                            <button className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#ef2336] px-5 text-sm font-black shadow-[0_18px_42px_rgba(239,35,54,0.38)] hover:bg-[#ff3144]">
                                <UserPlus size={18} />
                                Nuevo cliente
                            </button>
                        </div>
                    </section>

                    <section className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                        {summary.map((item) => (
                            <article className="rounded-[22px] border border-white/[0.08] bg-[#121318] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" key={item.label}>
                                <p className="text-sm font-semibold text-zinc-500">{item.label}</p>
                                <div className="mt-4 flex items-end justify-between gap-3">
                                    <p className="text-4xl font-black tracking-tight">{item.value}</p>
                                    <span className="rounded-full bg-[#ef2336]/10 px-3 py-1 text-xs font-black text-[#ff5260]">
                                        {item.detail}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </section>

                    <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
                        <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-black">Todos los clientes</h2>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Lista obtenida desde /api/trainers/clients
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <label className="relative">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                                        <input
                                            className="h-11 w-full rounded-2xl border border-white/[0.09] bg-[#090a0c] pl-10 pr-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#ef2336]/70 sm:w-72"
                                            placeholder="Buscar por nombre"
                                        />
                                    </label>
                                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/[0.09] bg-[#090a0c] px-4 text-sm font-bold hover:bg-[#0d0e11]">
                                        <Filter size={17} />
                                        Estado
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex min-h-[320px] items-center justify-center gap-3 text-zinc-400">
                                    <Loader2 className="h-5 w-5 animate-spin text-[#ef2336]" />
                                    Cargando clientes...
                                </div>
                            ) : error ? (
                                <div className="flex min-h-[320px] items-center justify-center gap-3 p-6 text-rose-400">
                                    <AlertCircle className="h-5 w-5" />
                                    {error}
                                </div>
                            ) : clients.length === 0 ? (
                                <div className="min-h-[320px] p-6">
                                    <div className="grid h-full min-h-[260px] place-items-center rounded-2xl border border-dashed border-white/[0.12] text-center">
                                        <div>
                                            <Users className="mx-auto h-8 w-8 text-zinc-600" />
                                            <p className="mt-3 font-black">No hay clientes asignados</p>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                Cuando el trainer tenga clientes, apareceran aqui.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[780px] text-left text-sm">
                                        <thead className="border-b border-white/[0.08] text-xs uppercase tracking-[0.16em] text-zinc-500">
                                            <tr>
                                                <th className="px-5 py-4 font-black">Cliente</th>
                                                <th className="px-5 py-4 font-black">Email</th>
                                                <th className="px-5 py-4 font-black">Rutinas</th>
                                                <th className="px-5 py-4 font-black">Altura</th>
                                                <th className="px-5 py-4 font-black">Estado</th>
                                                <th className="px-5 py-4 font-black" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.06]">
                                            {clients.map((client) => {
                                                const name = getClientName(client);

                                                return (
                                                    <tr className="transition hover:bg-white/[0.025]" key={client.id}>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ef2336]/15 text-sm font-black text-[#ff5260]">
                                                                    {getInitials(name)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black">{name}</p>
                                                                    <p className="mt-1 text-xs text-zinc-500">
                                                                        ID cliente: {client.id}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 text-zinc-300">{client.email || "-"}</td>
                                                        <td className="px-5 py-4 text-zinc-300">{client.routine_ids?.length || 0}</td>
                                                        <td className="px-5 py-4 text-zinc-400">{client.height ? `${client.height} cm` : "Sin dato"}</td>
                                                        <td className="px-5 py-4"><StatusBadge client={client} /></td>
                                                        <td className="px-5 py-4">
                                                            <button className="grid h-9 w-9 place-items-center rounded-xl text-zinc-500 hover:bg-white/[0.05] hover:text-white">
                                                                <MoreHorizontal size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </article>

                        <aside className="space-y-6">
                            <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                {selectedClient ? (
                                    <>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ef2336]/15 text-lg font-black text-[#ff5260]">
                                                    {getInitials(getClientName(selectedClient))}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black">{getClientName(selectedClient)}</h2>
                                                    <p className="mt-1 text-sm text-zinc-500">Primer cliente de la lista</p>
                                                </div>
                                            </div>
                                            <StatusBadge client={selectedClient} />
                                        </div>

                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-2xl border border-white/[0.07] bg-[#090a0c] p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Rutinas</p>
                                                <p className="mt-2 font-black">{selectedClient.routine_ids?.length || 0}</p>
                                            </div>
                                            <div className="rounded-2xl border border-white/[0.07] bg-[#090a0c] p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Altura</p>
                                                <p className="mt-2 font-black">{selectedClient.height ? `${selectedClient.height} cm` : "Sin dato"}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center text-sm text-zinc-500">
                                        Selecciona o crea un cliente para ver su ficha.
                                    </div>
                                )}
                            </article>

                            <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                <h2 className="text-xl font-black">Acciones rapidas</h2>
                                <div className="mt-5 space-y-3">
                                    {["Asignar rutina", "Registrar nota", "Enviar mensaje", "Programar sesion"].map((action) => (
                                        <button
                                            className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-[#090a0c] px-4 text-left text-sm font-bold text-zinc-300 hover:border-[#ef2336]/45 hover:text-white"
                                            key={action}
                                        >
                                            {action}
                                            <ChevronRight size={18} className="text-zinc-600" />
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </aside>
                    </section>
                </div>
            </section>
        </main>
    );
}
