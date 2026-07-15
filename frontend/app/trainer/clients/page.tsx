"use client";

import { Plus, Filter, ChevronRight, Search } from "lucide-react";
import { PageHeader } from "../layout";
import Link from "next/link";

type Status = "Activo" | "Onboarding" | "En pausa" | "Renovar";

const clients: Array<{
    id: string;
    name: string;
    img: string;
    goal: string;
    plan: string;
    next: string;
    adherence: number;
    status: Status;
}> = [
        {
            id: "lucia-martin",
            name: "Lucía Martín",
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces",
            goal: "Hipertrofia",
            plan: "Premium · Mensual",
            next: "Hoy 09:00",
            adherence: 92,
            status: "Activo",
        },
        {
            id: "ivan-romero",
            name: "Iván Romero",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces",
            goal: "Pérdida de grasa",
            plan: "Esencial · Mensual",
            next: "Mañana 10:30",
            adherence: 78,
            status: "Activo",
        },
        {
            id: "sara-lopez",
            name: "Sara López",
            img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces",
            goal: "Fuerza",
            plan: "Premium · Trimestral",
            next: "Hoy 12:00",
            adherence: 96,
            status: "Activo",
        },
        {
            id: "marc-puig",
            name: "Marc Puig",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
            goal: "Recomposición",
            plan: "Premium · Mensual",
            next: "Hoy 17:00",
            adherence: 60,
            status: "Onboarding",
        },
        {
            id: "noa-garcia",
            name: "Noa García",
            img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces",
            goal: "Rendimiento",
            plan: "Premium · Mensual",
            next: "Hoy 18:30",
            adherence: 84,
            status: "Activo",
        },
        {
            id: "diego-saez",
            name: "Diego Sáez",
            img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces",
            goal: "Volumen",
            plan: "Esencial · Mensual",
            next: "—",
            adherence: 41,
            status: "Renovar",
        },
        {
            id: "ana-prieto",
            name: "Ana Prieto",
            img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120&h=120&fit=crop&crop=faces",
            goal: "Salud general",
            plan: "Esencial · Mensual",
            next: "—",
            adherence: 22,
            status: "En pausa",
        },
    ];

const statusStyles: Record<Status, string> = {
    Activo: "bg-emerald-500/10 text-emerald-400",
    Onboarding: "bg-amber-500/10 text-amber-400",
    "En pausa": "bg-muted-foreground/10 text-muted-foreground",
    Renovar: "bg-rose-500/10 text-rose-400",
};

const filters = ["Todos", "Activos", "Onboarding", "Renovar", "En pausa"];

export default function ClientsPage() {
    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title="Clientes"
                subtitle="24 clientes activos · 2 pendientes de renovar"
                actions={
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white"
                    >
                        <Plus className="h-4 w-4" /> Nuevo cliente
                    </button>
                }
            />

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="relative max-w-sm flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        placeholder="Buscar cliente…"
                        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/60"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card p-1">
                    {filters.map((f, i) => (
                        <button
                            key={f}
                            type="button"
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${i === 0
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40"
                >
                    <Filter className="h-4 w-4 text-muted-foreground" /> Filtros
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <table className="w-full text-sm">
                    <thead className="bg-background/50 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                            <th className="hidden px-5 py-3 text-left font-semibold md:table-cell">Objetivo</th>
                            <th className="hidden px-5 py-3 text-left font-semibold lg:table-cell">Plan</th>
                            <th className="hidden px-5 py-3 text-left font-semibold lg:table-cell">Próxima sesión</th>
                            <th className="px-5 py-3 text-left font-semibold">Adherencia</th>
                            <th className="px-5 py-3 text-left font-semibold">Estado</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id} className="border-t border-border hover:bg-background/40">
                                <td className="px-5 py-3">
                                    <Link
                                        href={`/clients/${c.id}`}
                                        className="flex items-center gap-3"
                                    >
                                        <img
                                            src={c.img}
                                            alt={c.name}
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold">{c.name}</div>
                                            <div className="text-xs text-muted-foreground md:hidden">{c.goal}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{c.goal}</td>
                                <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{c.plan}</td>
                                <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{c.next}</td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-accent">
                                            <div
                                                className={`h-full ${c.adherence > 75
                                                    ? "bg-emerald-500"
                                                    : c.adherence > 50
                                                        ? "bg-amber-500"
                                                        : "bg-rose-500"
                                                    }`}
                                                style={{ width: `${c.adherence}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium">{c.adherence}%</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[c.status]}`}
                                    >
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <Link
                                        href={`/clients/${c.id}`}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                                    >

                                        Ver <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
