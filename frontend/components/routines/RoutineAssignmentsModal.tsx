"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Spinner } from "@/components/ui/Spinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { WeekDayBadge } from "@/components/ui/WeekDayBadge"
import { getRoutineAssignments } from "@/services/trainerService"
import { unassignRoutineFromClient } from "@/services/routineService"
import type { RoutineAssignment } from "@/lib/types"

interface RoutineAssignmentsModalProps {
    isOpen: boolean
    onClose: () => void
    routineId: number
    routineName: string
    onAssignmentRemoved: () => void
}

export function RoutineAssignmentsModal({
    isOpen,
    onClose,
    routineId,
    routineName,
    onAssignmentRemoved,
}: RoutineAssignmentsModalProps) {
    const [assignments, setAssignments] = useState<RoutineAssignment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [removeTarget, setRemoveTarget] = useState<{
        clientId: number
        clientName: string
    } | null>(null)
    const [isRemoving, setIsRemoving] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        if (!isOpen) return
        setIsLoading(true)
        getRoutineAssignments(routineId, controller.signal)
            .then(setAssignments)
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err)
            })
            .finally(() => setIsLoading(false))
        return () => controller.abort()
    }, [isOpen, routineId])

    const handleRemove = useCallback(async () => {
        if (!removeTarget) return
        setIsRemoving(true)
        try {
            await unassignRoutineFromClient(routineId, removeTarget.clientId)
            const updated = assignments.filter(
                (a) => a.client_id !== removeTarget.clientId
            )
            setAssignments(updated)
            setRemoveTarget(null)
            onAssignmentRemoved()

            if (updated.length === 0) {
                onClose()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsRemoving(false)
        }
    }, [removeTarget, routineId, assignments, onClose, onAssignmentRemoved])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assignments" className="!max-w-lg">
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    Clients assigned to{" "}
                    <span className="font-medium text-foreground">"{routineName}"</span>
                </p>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner className="h-6 w-6" />
                    </div>
                ) : assignments.length === 0 ? (
                    <EmptyState
                        icon={<Users className="h-10 w-10" />}
                        title="No assignments"
                        description="This routine is not assigned to any client"
                    />
                ) : (
                    <div className="max-h-[50vh] space-y-2 overflow-y-auto">
                        {assignments.map((a) => (
                            <div
                                key={a.client_id}
                                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
                            >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                    {a.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {a.full_name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {a.email ?? "No email"}
                                    </p>
                                </div>
                                <WeekDayBadge day={a.week_day} />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setRemoveTarget({
                                            clientId: a.client_id,
                                            clientName: a.full_name,
                                        })
                                    }
                                    aria-label={`Remove assignment for ${a.full_name}`}
                                    className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/15 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={removeTarget !== null}
                onClose={() => {
                    if (!isRemoving) setRemoveTarget(null)
                }}
                onConfirm={handleRemove}
                title="Remove assignment"
                message={`Remove "${removeTarget?.clientName}" from "${routineName}"? This will only remove the assignment. The routine will remain available.`}
                confirmLabel="Remove"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isRemoving}
            />
        </Modal>
    )
}
