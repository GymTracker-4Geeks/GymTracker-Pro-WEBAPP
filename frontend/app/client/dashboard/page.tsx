"use client";

import { PageHeader } from "./layout";
import { Dumbbell, Flame, Clock, BarChart3, Plus, ChevronRight, Check, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getMe, getClientTrainer } from "@/services/clientService";
import { ClientProfileExtended, RoutineProfile, TrainerProfileExtended } from "@/lib/types";
import { getClientRoutines } from "@/services/routineService";

const weekData = [
    { day: "Lunes", value: 70 },
    { day: "Martes", value: 90 },
    { day: "Miércoles", value: 115 },
    { day: "Jueves", value: 80 },
    { day: "Viernes", value: 100 },
    { day: "Sábado", value: 70 },
    { day: "Domingo", value: 50 },
];

export default function DashboardPage() {
    const [client, setClient] = useState<ClientProfileExtended | null>(null);
    const [trainer, setTrainer] = useState<TrainerProfileExtended | null>(null);
    const [routine, setRoutine] = useState<RoutineProfile[] | null>(null);
    const [error, setError] = useState<string>('');

    const handleRoutine = async () => {
        try {
            const data = await getClientRoutines();
            setRoutine(data.routines)

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error has occurred.");
            }
        }
    };

    const handleClientTrainer = async () => {
        try {
            const data = await getClientTrainer();
            setTrainer(data.trainer);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error has occurred.");
            }
        }
    };

    const handleClientInfo = async () => {
        try {
            const data = await getMe();

            setClient(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error has occurred.");
            }
        }
    };

    useEffect(() => {

        handleRoutine();
        handleClientTrainer();
        handleClientInfo();
    }, []);

    if (error) return <p>{error}</p>;
    if (!client) return <p>Cargando...</p>;

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title={`¡Hola, ${client?.full_name}! 👋`}
                subtitle="Listo para superar tus límites hoy."
                actions={
                    <button
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white">
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
                {routine && routine.length > 0 && (
                    <section className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Rutina de hoy</h3>
                            <button className="text-sm font-medium text-primary hover:underline">Ver todo</button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {routine.map((item) => (
                                <div key={item.id} className="card-hover flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                                    <img
                                        alt={item.name}
                                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-semibold text-foreground">
                                            {item.name}
                                        </div>
                                    </div>

                                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </div>
                            ))}
                        </div>

                        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/60 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
                            Ir a Rutina
                        </button>
                    </section>
                )}

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
