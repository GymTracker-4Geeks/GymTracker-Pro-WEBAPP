"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Dumbbell, Flame, Clock, BarChart3, Plus, ChevronRight, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BodyWeightRecord, ClientProfileExtended, RoutineProfile, TodaySummary, TrainerProfileExtended } from "@/lib/types";
import { getDashboard } from "@/services/clientService";

export default function DashboardPage() {
    const router = useRouter();
    const [client, setClient] = useState<ClientProfileExtended | null>(null);
    const [trainer, setTrainer] = useState<TrainerProfileExtended | null>(null);
    const [bodyweight, setBodyWeight] = useState<BodyWeightRecord | null>(null);
    const [today_routine, setTodayRoutine] = useState<RoutineProfile | null>(null);
    const [todaysummary, setTodaySummary] = useState<TodaySummary | null>(null);
    const [error, setError] = useState<string>('');

    const dashboard = async (signal?: AbortSignal) => {
        try {
            const data = await getDashboard();
            setClient(data.client);
            setTrainer(data.trainer);
            setTodayRoutine(data.today_routine);
            setTodaySummary(data.today_summary);
            setBodyWeight(data.last_weight);
            
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return;
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error has occurred.");
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        dashboard(controller.signal);
        return () => controller.abort();
    }, []);

    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!client) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    const exercisesValue = today_routine?.exercises
        ? `${todaysummary?.completed_exercises || 0}/${today_routine.exercises.length}`
        : "0/0";

    return (
        
        
        <div className="mx-auto max-w-7xl px-4 py-6">
            <PageHeader
                title={`Hey, ${client.full_name}! 👋`}
                subtitle="Ready to push your limits today."
                actions={
                    <button
                        onClick={() => router.push("/client/workouts")}
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" /> New Workout
                    </button>
                }
            />

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl gradient-red glow-red p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Today Statistics</h2>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                        {[
                            { icon: Dumbbell, label: "Training", value: exercisesValue, unit: "exercises" },
                            { icon: Flame, label: "Calories", value: todaysummary?.estimated_calories || "0", unit: "kcal" },
                            { icon: Clock, label: "Time", value: todaysummary?.estimated_minutes || "0", unit: "min" },
                            { icon: BarChart3, label: "Volume", value: todaysummary?.volume || "0", unit: "kg" },
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

                <section className="flex flex-col justify-center">
                    <div className="mb-4">
                        <h3 className="text-base text-center font-semibold text-foreground">
                            Personal Trainer
                        </h3>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden">
                                <svg className="h-10 w-10 text-muted-foreground/60" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
                                </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                                {trainer ? (
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="truncate text-base font-semibold text-foreground">
                                                {trainer.full_name}
                                            </h4>
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                Pro
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground truncate">
                                            {trainer.specialty || "Fitness Specialist"}
                                        </p>
                                    </div>
                                ) : (
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        No assigned coach
                                    </h4>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                            {today_routine ? `Rutina: ${today_routine.name}` : "Today Routine"}
                        </h3>
                        {today_routine && (
                            <button
                                onClick={() => router.push("/client/routines")}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View more
                            </button>
                        )}
                    </div>

                    {today_routine && today_routine.exercises && today_routine.exercises.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {today_routine.exercises.map((item) => (
                                <div key={item.id} className="card-hover flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:bg-accent/5">
                                    <div className="h-16 w-16 shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border">
                                        <Dumbbell className="h-6 w-6 text-muted-foreground/70" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-semibold text-foreground">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {item.sets} sets x {item.reps} reps · {item.muscle_group}
                                        </div>
                                    </div>

                                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-card">
                            You don't have any exercises scheduled for today.
                        </div>
                    )}
                </section>

                <section className="flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg text-center font-semibold text-foreground">BodyWeight Progress</h3>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between flex-1 min-h-[160px]">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Weight registered</span>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-foreground tracking-tight">
                                {bodyweight ? bodyweight.weight : <span className="text-muted-foreground">No data</span>}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">kg</span>
                        </div>
                        {bodyweight && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Registered on {new Date(bodyweight.recorded_at).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

