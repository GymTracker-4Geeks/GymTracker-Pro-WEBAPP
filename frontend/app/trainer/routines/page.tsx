"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Copy, Pencil, Trash2, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"
import { DropdownMenu } from "@/components/ui/DropdownMenu"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Toast } from "@/components/ui/Toast"
import { PageHeader } from "../layout"
import { RoutineForm } from "@/components/routines/RoutineForm"
import { getTrainerRoutines } from "@/services/trainerService"
import { deleteRoutine } from "@/services/routineService"
import type { RoutineProfile } from "@/lib/types"

function RoutineCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card" aria-hidden="true">
            <Skeleton className="h-24 w-full rounded-none" />
            <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-3 w-48" />
                <div className="flex gap-2 pt-1">
                    <Skeleton className="h-7 flex-1" />
                    <Skeleton className="h-7 w-10" />
                    <Skeleton className="h-7 flex-1" />
                </div>
            </div>
        </div>
    )
}

export default function RoutinesPage() {
    const [isCreating, setIsCreating] = useState(false)
    const [editingRoutine, setEditingRoutine] = useState<RoutineProfile | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<RoutineProfile | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [routines, setRoutines] = useState<RoutineProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const fetchRoutines = useCallback(() => {
        setIsLoading(true)
        getTrainerRoutines()
            .then(setRoutines)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchRoutines()
    }, [fetchRoutines])

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

            {isLoading ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading routines">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <RoutineCardSkeleton key={i} />
                    ))}
                </div>
            ) : routines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No routines yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                        Create your first routine to get started
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {routines.map((r) => (
                        <div
                            key={r.id}
                            className="card-hover overflow-hidden rounded-2xl border border-border bg-card"
                        >
                            <div className="h-24 bg-gradient-to-br from-primary/80 to-primary relative">
                                <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                                    {r.exercises.length} exercises
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-base font-semibold text-foreground">
                                            {r.name}
                                        </h3>
                                        {r.description ? (
                                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                                {r.description}
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-xs text-muted-foreground/50 italic">
                                                No description
                                            </p>
                                        )}
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
                                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                                        {r.exercises.length} exercise{r.exercises.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingRoutine(r)}
                                        className="flex-1 rounded-lg border border-border bg-background py-1.5 text-xs font-semibold transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Duplicate routine"
                                        className="rounded-lg border border-border bg-background px-2 py-1.5 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
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
