"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, Copy, Dumbbell, Trash2, Calendar, Users, Search } from "lucide-react"
import { SearchInput } from "@/components/ui/SearchInput"
import { Select } from "@/components/ui/Select"
import { DropdownMenu } from "@/components/ui/DropdownMenu"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Toast } from "@/components/ui/Toast"
import { PageHeader } from "@/components/ui/PageHeader"
import { RoutineForm } from "@/components/routines/RoutineForm"
import { AssignRoutineModal } from "@/components/routines/AssignRoutineModal"
import { RoutineAssignmentsModal } from "@/components/routines/RoutineAssignmentsModal"
import { getTrainerRoutines } from "@/services/trainerService"
import { deleteRoutine, duplicateRoutine } from "@/services/routineService"
import type { RoutineProfile } from "@/lib/types"

export default function RoutinesPage() {
    const [isCreating, setIsCreating] = useState(false)
    const [editingRoutine, setEditingRoutine] = useState<RoutineProfile | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<RoutineProfile | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [assignTarget, setAssignTarget] = useState<RoutineProfile | null>(null)
    const [assignmentsTarget, setAssignmentsTarget] = useState<RoutineProfile | null>(null)
    const [routines, setRoutines] = useState<RoutineProfile[]>([])
    const [sortBy, setSortBy] = useState("Newest")
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const fetchRoutines = useCallback((signal?: AbortSignal) => {
        setIsLoading(true)
        getTrainerRoutines(signal)
            .then((data) => {
                setRoutines(data)
                setIsLoading(false)
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === "AbortError") return
                console.error(err)
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchRoutines(controller.signal)
        return () => controller.abort()
    }, [fetchRoutines])

    const sortedRoutines = useMemo(() => {
        const sorted = [...routines]
        switch (sortBy) {
            case "Oldest":
                return sorted.sort((a, b) => a.id - b.id)
            case "A-Z":
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case "Z-A":
                return sorted.sort((a, b) => b.name.localeCompare(a.name))
            case "Most assigned":
                return sorted.sort((a, b) => b.assigned_count - a.assigned_count)
            case "Least assigned":
                return sorted.sort((a, b) => a.assigned_count - b.assigned_count)
            case "Newest":
            default:
                return sorted.sort((a, b) => b.id - a.id)
        }
    }, [routines, sortBy])

    const filteredRoutines = useMemo(() => {
        if (!search.trim()) return sortedRoutines
        const term = search.toLowerCase()
        return sortedRoutines.filter(
            (r) =>
                r.name.toLowerCase().includes(term) ||
                r.description.toLowerCase().includes(term)
        )
    }, [sortedRoutines, search])

    const handleSaved = useCallback(() => {
        fetchRoutines()
        setIsCreating(false)
        setEditingRoutine(null)
    }, [fetchRoutines])

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            await deleteRoutine(deleteTarget.id)
            setToast({ message: `"${deleteTarget.name}" deleted`, type: "success" })
            setDeleteTarget(null)
            fetchRoutines()
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to delete routine",
                type: "error",
            })
        } finally {
            setIsDeleting(false)
        }
    }, [deleteTarget, fetchRoutines])

    const handleDuplicate = useCallback(async (routine: RoutineProfile) => {
        try {
            await duplicateRoutine(routine.id)
            setToast({ message: `"${routine.name}" duplicated`, type: "success" })
            fetchRoutines()
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to duplicate routine",
                type: "error",
            })
        }
    }, [fetchRoutines])

    if (isCreating) {
        return (
            <div className="mx-auto max-w-7xl">
                <PageHeader
                    title="New Routine"
                    subtitle="Create a routine using the exercise library"
                    actions={
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            Cancel
                        </button>
                    }
                />
                <RoutineForm onCancel={() => setIsCreating(false)} onSaved={handleSaved} />
            </div>
        )
    }

    if (editingRoutine) {
        return (
            <div className="mx-auto max-w-7xl">
                <PageHeader
                    title="Edit routine"
                    subtitle="Modify routine details and exercises"
                    actions={
                        <button
                            type="button"
                            onClick={() => setEditingRoutine(null)}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            Cancel
                        </button>
                    }
                />
                <RoutineForm
                    routine={editingRoutine}
                    onCancel={() => setEditingRoutine(null)}
                    onSaved={handleSaved}
                />
            </div>
        )
    }

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title="Routines"
                subtitle="Your library of programs to assign to clients"
                actions={
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" /> New Routine
                    </button>
                }
            />

            <div className="mb-5 flex items-center gap-4">
                <SearchInput
                    value=""
                    onChange={setSearch}
                    placeholder="Search routines..."
                    debounceMs={300}
                    className="flex-1"
                />
                <div className="w-44 flex-shrink-0">
                    <Select
                        label="Sort by"
                        value={sortBy}
                        options={["Newest", "Oldest", "A-Z", "Z-A", "Most assigned", "Least assigned"]}
                        onChange={setSortBy}
                        placeholder="Select order"
                    />
                </div>
            </div>

            {filteredRoutines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    {search ? (
                        <>
                            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                            <p className="text-sm font-medium text-muted-foreground">
                                No routines found
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground/60">
                                Try a different search term
                            </p>
                        </>
                    ) : (
                        <>
                            <Calendar className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                            <p className="text-sm font-medium text-muted-foreground">
                                No routines yet
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground/60">
                                Create your first routine to get started
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRoutines.map((r) => (
                        <div
                            key={r.id}
                            className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                        >
                            <div className="h-24 bg-gradient-to-br from-primary/80 to-primary relative">
                                <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                                    {r.exercises.length} exercises
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-base font-semibold text-foreground">
                                            {r.name}
                                        </h3>
                                        <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs text-muted-foreground">
                                            {r.description || (
                                                <span className="italic text-muted-foreground/50">No description</span>
                                            )}
                                        </p>
                                    </div>
                                    <DropdownMenu
                                        items={[
                                            {
                                                label: "Delete",
                                                icon: <Trash2 className="h-4 w-4" />,
                                                onClick: () => setDeleteTarget(r),
                                                variant: "destructive",
                                            },
                                        ]}
                                    />
                                </div>
                                <div className="mt-4 flex items-center gap-5">
                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                                        <Dumbbell className="h-4 w-4" aria-hidden="true" />
                                        {r.exercises.length} exercise{r.exercises.length !== 1 ? "s" : ""}
                                    </span>
                                    {r.assigned_count > 0 ? (
                                        <button
                                            type="button"
                                            onClick={() => setAssignmentsTarget(r)}
                                            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            <Users className="h-4 w-4" aria-hidden="true" />
                                            {r.assigned_count} client{r.assigned_count !== 1 ? "s" : ""}
                                        </button>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                            <Users className="h-4 w-4" aria-hidden="true" />
                                            0 clients assigned
                                        </span>
                                    )}
                                </div>
                                <div className="mt-auto flex gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingRoutine(r)}
                                        className="flex-1 rounded-lg border border-border bg-background py-1.5 text-xs font-semibold transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDuplicate(r)}
                                        aria-label="Duplicate routine"
                                        className="rounded-lg border border-border bg-background px-2 py-1.5 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        <Copy className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAssignTarget(r)}
                                        className="flex-1 rounded-lg gradient-red py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        Assign
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onClose={() => {
                    if (!isDeleting) setDeleteTarget(null)
                }}
                onConfirm={handleDelete}
                title="Delete routine"
                message={`Are you sure you want to delete "${deleteTarget?.name ?? ""}"? This action is irreversible and will remove all exercises and client assignments.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isDeleting}
            />
            <AssignRoutineModal
                isOpen={assignTarget !== null}
                onClose={() => setAssignTarget(null)}
                routineId={assignTarget?.id ?? 0}
                routineName={assignTarget?.name ?? ""}
                onAssigned={() => {
                    setAssignTarget(null)
                    setToast({ message: "Routine assigned successfully", type: "success" })
                }}
            />
            <RoutineAssignmentsModal
                isOpen={assignmentsTarget !== null}
                onClose={() => setAssignmentsTarget(null)}
                routineId={assignmentsTarget?.id ?? 0}
                routineName={assignmentsTarget?.name ?? ""}
                onAssignmentRemoved={fetchRoutines}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
