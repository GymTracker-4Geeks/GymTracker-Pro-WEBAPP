"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, Search, ClipboardList } from "lucide-react"
import { SearchInput } from "@/components/ui/SearchInput"
import { Select } from "@/components/ui/Select"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Toast } from "@/components/ui/Toast"
import { PageHeader } from "@/components/ui/PageHeader"
import { WorkoutLogCard } from "@/components/workouts/WorkoutLogCard"
import { WorkoutLogFormModal } from "@/components/workouts/WorkoutLogFormModal"
import { getWorkoutLogs, deleteWorkoutLog } from "@/services/workoutService"
import type { WorkoutLogEntry } from "@/lib/types"

export default function WorkoutsPage() {
    const [logs, setLogs] = useState<WorkoutLogEntry[]>([])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("Newest")
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [modalState, setModalState] = useState<{
        mode: "create" | "edit"
        log?: WorkoutLogEntry
    } | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<WorkoutLogEntry | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [fetchError, setFetchError] = useState<string | null>(null)

    const fetchLogs = useCallback((signal?: AbortSignal) => {
        setIsLoading(true)
        setFetchError(null)
        getWorkoutLogs(signal)
            .then((data) => {
                setLogs(data)
                setIsLoading(false)
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === "AbortError") return
                setFetchError(err instanceof Error ? err.message : "Failed to load workouts")
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchLogs(controller.signal)
        return () => controller.abort()
    }, [fetchLogs])

    const sortedLogs = useMemo(() => {
        const sorted = [...logs]
        switch (sortBy) {
            case "Oldest":
                return sorted.sort(
                    (a, b) => new Date(a.performed_at).getTime() - new Date(b.performed_at).getTime()
                )
            case "Newest":
            default:
                return sorted.sort(
                    (a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
                )
        }
    }, [logs, sortBy])

    const filteredLogs = useMemo(() => {
        if (!search.trim()) return sortedLogs
        const term = search.toLowerCase()
        return sortedLogs.filter((l) =>
            (l.exercise_name ?? "").toLowerCase().includes(term)
        )
    }, [sortedLogs, search])

    const handleSaved = useCallback((log: WorkoutLogEntry) => {
        setLogs((prev) => {
            const exists = prev.find((l) => l.id === log.id)
            if (exists) {
                return prev.map((l) => (l.id === log.id ? log : l))
            }
            return [log, ...prev]
        })
        setModalState(null)
    }, [])

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            await deleteWorkoutLog(deleteTarget.id)
            setLogs((prev) => prev.filter((l) => l.id !== deleteTarget.id))
            setToast({ message: "Workout Log deleted", type: "success" })
            setDeleteTarget(null)
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to delete",
                type: "error",
            })
        } finally {
            setIsDeleting(false)
        }
    }, [deleteTarget])

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title="Workouts"
                subtitle="Track your training sessions"
                actions={
                    <button
                        type="button"
                        onClick={() => setModalState({ mode: "create" })}
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" /> New Workout
                    </button>
                }
            />

            <div className="mb-5 flex items-center gap-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by exercise name..."
                    debounceMs={300}
                    className="flex-1"
                />
                <div className="w-40 flex-shrink-0">
                    <Select
                        label="Sort by"
                        value={sortBy}
                        options={["Newest", "Oldest"]}
                        onChange={setSortBy}
                        placeholder="Select order"
                    />
                </div>
            </div>

            {fetchError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="mb-4 h-12 w-12 text-destructive/30" aria-hidden="true" />
                    <p className="text-sm font-medium text-destructive">{fetchError}</p>
                    <button
                        onClick={() => fetchLogs()}
                        className="mt-3 text-sm font-medium text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    {search ? (
                        <>
                            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                            <p className="text-sm font-medium text-muted-foreground">No workouts found</p>
                            <p className="mt-1 text-xs text-muted-foreground/60">Try a different search term</p>
                        </>
                    ) : (
                        <>
                            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                            <p className="text-sm font-medium text-muted-foreground">No workout logs yet</p>
                            <p className="mt-1 text-xs text-muted-foreground/60">Start logging your workouts</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredLogs.map((log) => (
                        <WorkoutLogCard
                            key={log.id}
                            log={log}
                            onEdit={() => setModalState({ mode: "edit", log })}
                            onDelete={() => setDeleteTarget(log)}
                        />
                    ))}
                </div>
            )}

            <WorkoutLogFormModal
                isOpen={modalState !== null}
                onClose={() => setModalState(null)}
                mode={modalState?.mode ?? "create"}
                log={modalState?.log}
                onSaved={handleSaved}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onClose={() => { if (!isDeleting) setDeleteTarget(null) }}
                onConfirm={handleDelete}
                title="Delete Workout Log"
                message={`Are you sure you want to delete "${deleteTarget?.exercise_name ?? 'this workout'}"? This action is irreversible.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isDeleting}
            />
        </div>
    )
}
