"use client";

import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExerciseProfile } from "@/lib/types";
import { getExercises } from "@/services/exerciseService";

const filters = ["All", "Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Abs"];

export default function ExercisesPage() {
    const [active, setActive] = useState<string>("All");
    const [exercises, setExercises] = useState<ExerciseProfile[] | null>(null);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState("");
    const [favs, setFavs] = useState<Record<string, boolean>>({});

    const handleExercises = async (signal?: AbortSignal) => {
        try {
            const data = await getExercises();
            setExercises(data);
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
        handleExercises(controller.signal);
        return () => controller.abort();
    }, []);

    const filtered: ExerciseProfile[] = exercises
        ? exercises.filter((e) =>
            (active === "All" || e.muscle_group === active) &&
            (!search.trim() || e.name.toLowerCase().includes(search.toLowerCase()))
        )
        : [];

    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!exercises) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Exercises" subtitle="Explore the complete library of exercises." />

            <div className="mb-6 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[260px]">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Exercise..."
                        className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
                    />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActive(f)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${active === f
                            ? "bg-primary text-primary-foreground glow-red"
                            : "border border-border bg-card text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={<Search className="h-12 w-12" />}
                    title={search ? "No exercises found" : "No exercises in this category"}
                    description={search ? "Try a different search term" : "Try selecting a different filter"}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((ex) => {
                        const fav = favs[ex.name];
                        return (
                            <div key={ex.name} className="card-hover group overflow-hidden rounded-xl border border-border bg-card">
                                <div className="relative h-36 overflow-hidden">
                                    <button
                                        onClick={() => setFavs((p) => ({ ...p, [ex.name]: !fav }))}
                                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md bg-black/40 backdrop-blur-md"
                                    >
                                        <Star className={`h-4 w-4 ${fav ? "fill-primary text-primary" : "text-white"}`} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="truncate font-semibold">{ex.name}</div>
                                    <div className="text-xs font-medium text-primary">{ex.muscle_group}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
