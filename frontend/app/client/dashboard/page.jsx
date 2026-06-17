"use client";

import { PageHeader } from "./layout";
import { Dumbbell, Flame, Clock, BarChart3, Plus, ChevronRight, Check, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const todayExercises = [
    // { name: "Press de banca", sets: "4 series x 10 reps", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop", done: true },
    // { name: "Dominadas", sets: "4 series x 8 reps", img: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=300&h=200&fit=crop", done: true },
    // { name: "Sentadilla", sets: "4 series x 12 reps", img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=200&fit=crop", done: true },
    // { name: "Curl de bíceps", sets: "3 series x 12 reps", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop", done: true },
];

const weekData = [
    { day: "Lunes", value: 70 },
    { day: "Martes", value: 90 },
    { day: "Miércoles", value: 115 },
    { day: "Jueves", value: 80 },
    { day: "Viernes", value: 100 },
    { day: "Sábado", value: 70 },
    { day: "Domingo", value: 50 },
];

const activity = [
];

export default function DashboardPage() {
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);
    const [trainer, setTrainer] = useState(null);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    "http://127.0.0.1:5000/api/clients/trainer",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                setTrainer(data.trainer);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchClient = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    "http://127.0.0.1:5000/api/clients/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("No se pudo obtener el cliente");
                }

                const data = await response.json();
                setClient(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTrainer();
        fetchClient();
    }, []);

    if (error) return <p>{error}</p>;
    if (!client) return <p>Cargando...</p>;

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title={`¡Hola, ${client.full_name}! 👋`}
                subtitle="Listo para superar tus límites hoy."
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white">
                        <Plus className="h-4 w-4" /> Nuevo entrenamiento
                    </button>
                }
            />

            <div className="grid gap-5 lg:grid-cols-3 ">
                <div className="lg:col-span-2 rounded-2xl gradient-red glow-red p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Resumen de hoy</h2>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                        {[
                            { icon: Dumbbell, label: "Entrenamiento", value: "0/5", unit: "ejercicios" },
                            { icon: Flame, label: "Calorías", value: "0", unit: "kcal" },
                            { icon: Clock, label: "Tiempo", value: "0", unit: "min" },
                            { icon: BarChart3, label: "Volumen", value: "0", unit: "kg" },
                        ].map((s) => (
                            <div key={s.label}>
                                <s.icon className="h-5 w-5 text-white/80" />
                                <div className="mt-2 text-xs uppercase tracking-wide text-white/70">{s.label}</div>
                                <div className="mt-1 text-2xl font-bold text-white">{s.value}</div>
                                <div className="text-xs text-white/70">{s.unit}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <section>
                    <div className="mb-4">
                        <h3 className="text-center text-lg font-semibold">
                            Entrenador
                        </h3>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden">
                                <svg
                                    className="h-10 w-10 text-muted-foreground/60"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
                                </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    {trainer ? (
                                        <>
                                            <h4 className="truncate text-base font-semibold leading-none">
                                                {trainer.full_name}
                                            </h4>
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xxs font-medium text-primary">
                                                Pro
                                            </span>

                                            <p className="text-xs text-neutral-400 leading-none">
                                                {trainer.specialty}
                                            </p>
                                        </>
                                    ) : (
                                        <h4 className="truncate text-base font-semibold leading-none">
                                            No tienes un entrenador asignado
                                        </h4>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Rutina de hoy</h3>
                        <button className="text-sm font-medium text-primary hover:underline">Ver todo</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {todayExercises.map((ex) => (
                            <div key={ex.name} className="card-hover flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                                <img src={ex.img} alt={ex.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate font-semibold">{ex.name}</div>
                                    <div className="text-xs text-muted-foreground">{ex.sets}</div>
                                    {ex.done && (
                                        <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                            <Check className="h-3 w-3" /> Completado
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                    <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/60 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
                        Ir a Rutina
                    </button>
                </section>

            </div>

            <section className="mt-8 rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Progreso semanal</h3>
                        <p className="text-xs text-muted-foreground">% de objetivo alcanzado por día</p>
                    </div>
                </div>
                <div
                    className="w-full min-w-0"
                    style={{ height: 300 }}
                >
                    <BarChart width={800} height={300} data={weekData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip
                            cursor={false}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;

                                return (
                                    <div
                                        className="rounded-lg border border-border bg-card p-3 shadow-lg"
                                    >
                                        <p className="font-semibold">{label}</p>
                                        <p className="text-primary font-medium">
                                            {payload[0].value}%
                                        </p>
                                    </div>
                                );
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#ef4444"
                            activeBar={false}
                            tabIndex={-1}
                        />
                    </BarChart>
                </div>
            </section>
        </div>
    );
}
