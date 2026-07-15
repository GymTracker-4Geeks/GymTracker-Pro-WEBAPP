"use client";

import { Plus, Clock, Dumbbell, MoreHorizontal, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "../layout";
import { getClientRoutines } from "@/services/routineService";
import { RoutineProfile } from "@/lib/types";

const fallbackImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop"
];

export default function RoutinesPage() {
    const [tab, setTab] = useState<"Assigned" | "Favorite">("Assigned");
    const [routine, setRoutine] = useState<RoutineProfile[] | null>(null);
    const [error, setError] = useState<string>('');

    const routines = async () => {
        try {
            const data = await getClientRoutines();

            if (data && Array.isArray(data)) {
                setRoutine(data);
            } else if (data && data.routines && Array.isArray(data.routines)) {
                setRoutine(data.routines);
            } else {
                setRoutine([]);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error has occurred.");
            }
        }
    };

    useEffect(() => {
        routines();
    }, []);

    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!routine) return <p className="p-6 text-muted-foreground animate-pulse">Loading...</p>;

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <PageHeader
                title="Routines"
                subtitle="Organize, edit, and start your favorite routines."
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white">
                        <Plus className="h-4 w-4" /> Create Routine
                    </button>
                }
            />

            <div className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1 w-fit">
                {[
                    { id: "Assigned", label: "My Routines" },
                    { id: "Favorite", label: "Favorite Routines" },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id as "Assigned" | "Favorite")}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {routine.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {routine.map((r, index) => (
                        <div key={r.id} className="card-hover group overflow-hidden rounded-2xl border border-border bg-card">
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={fallbackImages[index % fallbackImages.length]}
                                    alt={r.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                                <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md bg-black/40 text-white backdrop-blur-md hover:bg-black/60">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                                <h3 className="absolute bottom-3 left-4 right-4 text-xl font-bold text-white truncate">{r.name}</h3>
                            </div>
                            <div className="p-5 flex flex-col justify-between min-h-[160px]">
                                <div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                        {r.description || "No description provided for this routine."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Dumbbell className="h-4 w-4 text-primary" />
                                            {r.exercises?.length || 0} exercises
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-primary" />
                                            {(r.exercises?.length || 0) * 10} min
                                        </span>
                                    </div>
                                </div>
                                <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg gradient-red px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]">
                                    <Play className="h-4 w-4 fill-white" /> Start Routine
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground bg-card">
                    No routines assigned to your profile yet.
                </div>
            )}
        </div>
    );
}
