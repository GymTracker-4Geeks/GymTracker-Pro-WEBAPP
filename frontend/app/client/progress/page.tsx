"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Scale, Dumbbell, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Skeleton } from "@/components/ui/Skeleton"
import { Badge } from "@/components/ui/Badge"
import { getWeights } from "@/services/bodyweightService"
import { getWorkoutLogs } from "@/services/workoutService"
import type { BodyWeightRecord, WorkoutLogEntry } from "@/lib/types"

function StatCard({ icon: Icon, label, value, unit, trend }: {
    icon: React.ElementType
    label: string
    value: string | number
    unit?: string
    trend?: { value: string; up: boolean }
}) {
    return (
        <div className="card-hover rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
                {trend && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {trend.up
                            ? <TrendingUp className="h-3 w-3" />
                            : <TrendingDown className="h-3 w-3" />}
                        {trend.value}
                    </span>
                )}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
            {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
        </div>
    )
}

function SectionSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ProgressPage() {
    const [weights, setWeights] = useState<BodyWeightRecord[]>([])
    const [logs, setLogs] = useState<WorkoutLogEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const [w, l] = await Promise.all([
                getWeights(signal),
                getWorkoutLogs(signal),
            ])
            setWeights(w)
            setLogs(l)
            setIsLoading(false)
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return
            setError(err instanceof Error ? err.message : "Failed to load data")
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchData(controller.signal)
        return () => controller.abort()
    }, [fetchData])

    const stats = useMemo(() => {
        if (!weights.length && !logs.length) return null

        const sortedWeights = [...weights].sort(
            (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
        )
        const sortedLogs = [...logs].sort(
            (a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
        )

        const initialWeight = sortedWeights[sortedWeights.length - 1] ?? null
        const currentWeight = sortedWeights[0] ?? null
        const weightChange = currentWeight && initialWeight
            ? currentWeight.weight - initialWeight.weight
            : 0
        const minWeight = sortedWeights.length
            ? Math.min(...sortedWeights.map((w) => w.weight))
            : 0
        const maxWeight = sortedWeights.length
            ? Math.max(...sortedWeights.map((w) => w.weight))
            : 0

        const totalWorkouts = sortedLogs.length
        const totalVolume = sortedLogs.reduce(
            (sum, l) => sum + l.sets * l.weight * l.reps,
            0
        )

        const now = new Date()
        const dayOfWeek = now.getDay()
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const weekStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - daysFromMonday
        )
        weekStart.setHours(0, 0, 0, 0)
        const weeklyVolume = sortedLogs
            .filter((l) => new Date(l.performed_at) >= weekStart)
            .reduce((sum, l) => sum + l.sets * l.weight * l.reps, 0)

        const exerciseCounts: Record<string, number> = {}
        sortedLogs.forEach((l) => {
            const name = l.exercise_name ?? `Exercise #${l.exercise_id}`
            exerciseCounts[name] = (exerciseCounts[name] ?? 0) + 1
        })
        const mostPerformed =
            Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
            "N/A"

        const lastWorkout = sortedLogs[0] ?? null

        const weightHistory = sortedWeights

        return {
            initialWeight,
            currentWeight,
            weightChange,
            minWeight,
            maxWeight,
            weightHistory,
            totalWorkouts,
            totalVolume,
            weeklyVolume,
            mostPerformed,
            lastWorkout,
        }
    }, [weights, logs])

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    if (error) {
        return (
            <div className="mx-auto max-w-7xl">
                <PageHeader title="Progress" subtitle="Your progress, metrics, and trends at a glance." />
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm font-medium text-destructive">{error}</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-3 text-sm font-medium text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="mx-auto max-w-7xl">
                <PageHeader title="Progress" subtitle="Your progress, metrics, and trends at a glance." />
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Scale className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                    <p className="text-sm font-medium text-muted-foreground">No data yet</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                        Start logging workouts and weight to see your progress
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Progress" subtitle="Your progress, metrics, and trends at a glance." />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={TrendingUp}
                    label="Weight Change"
                    value={stats.weightChange > 0 ? `+${stats.weightChange.toFixed(1)}` : stats.weightChange.toFixed(1)}
                    unit="kg"
                    trend={stats.weightChange !== 0
                        ? { value: `${Math.abs(stats.weightChange).toFixed(1)} kg`, up: stats.weightChange < 0 }
                        : { value: "No change", up: true }
                    }
                />
                <StatCard
                    icon={Dumbbell}
                    label="Total Volume"
                    value={stats.totalVolume.toLocaleString()}
                    unit="kg"
                />
                <StatCard
                    icon={Calendar}
                    label="Total Workouts"
                    value={stats.totalWorkouts}
                />
                <StatCard
                    icon={Scale}
                    label="Current Weight"
                    value={stats.currentWeight ? `${stats.currentWeight.weight} kg` : "N/A"}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Weight History</h3>
                            <p className="text-xs text-muted-foreground">
                                {stats.weightHistory.length} records
                            </p>
                        </div>
                    </div>
                    {stats.weightHistory.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No weight records yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {stats.weightHistory.slice(0, 10).map((w, i, arr) => {
                                const prev = arr[i - 1]
                                const diff = prev ? w.weight - prev.weight : 0
                                return (
                                    <div
                                        key={w.id}
                                        className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {w.weight} kg
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(w.recorded_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        {i > 0 && (
                                            <Badge variant={diff < 0 ? "body_part" : "target"}>
                                                {diff > 0 ? "+" : ""}
                                                {diff.toFixed(1)} kg
                                            </Badge>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Training Summary</h3>
                            <p className="text-xs text-muted-foreground">
                                {stats.totalWorkouts} workouts logged
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                            <span className="text-sm text-muted-foreground">Total Volume</span>
                            <span className="text-sm font-semibold text-foreground">
                                {stats.totalVolume.toLocaleString()} kg
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                            <span className="text-sm text-muted-foreground">Weekly Volume</span>
                            <span className="text-sm font-semibold text-foreground">
                                {stats.weeklyVolume.toLocaleString()} kg
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                            <span className="text-sm text-muted-foreground">Total Workouts</span>
                            <span className="text-sm font-semibold text-foreground">
                                {stats.totalWorkouts}
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                            <span className="text-sm text-muted-foreground">Most Performed</span>
                            <span className="text-sm font-semibold text-foreground capitalize">
                                {stats.mostPerformed}
                            </span>
                        </div>
                        {stats.lastWorkout && (
                            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                                <span className="text-sm text-muted-foreground">Last Workout</span>
                                <span className="text-sm font-semibold text-foreground capitalize">
                                    {stats.lastWorkout.exercise_name ?? `Exercise #${stats.lastWorkout.exercise_id}`}
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
