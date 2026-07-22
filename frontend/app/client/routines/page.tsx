"use client";

import { Clock, Dumbbell, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { getClientRoutines } from "@/services/routineService";
import { RoutineProfile } from "@/lib/types";

const fallbackImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop"
];

export default function RoutinesPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"Assigned" | "Favorite">("Assigned");
    const [routine, setRoutine] = useState<RoutineProfile[] | null>(null);
    const [error, setError] = useState<string>('');

    const routines = async (signal?: AbortSignal) => {
        try {
            const data = await getClientRoutines();
            if (data && data.routines && Array.isArray(data.routines)) {
                setRoutine(data.routines);
            } else {
                setRoutine([]);
            }
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
        routines(controller.signal);
        return () => controller.abort();
    }, []);

    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!routine) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <PageHeader
                title="Routines"
                subtitle="Organize, edit, and start your favorite routines."
            />

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
                                <div className="absolute right-3 top-3">
                                    <DropdownMenu
                                        items={[
                                            {
                                                label: "Log Workout",
                                                icon: <Play className="h-4 w-4" />,
                                                onClick: () => router.push("/client/workouts"),
                                            },
                                        ]}
                                    />
                                </div>
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
                                <button
                                    onClick={() => router.push("/client/workouts")}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg gradient-red px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
                                >
                                    <Play className="h-4 w-4 fill-white" /> Start Routine
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<Dumbbell className="h-12 w-12" />}
                    title="No routines assigned"
                    description="No routines have been assigned to your profile yet."
                />
            )}
        </div>
    );
}
