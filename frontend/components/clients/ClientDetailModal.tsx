"use client"

import { useState, useEffect } from "react"
import { ListPlus } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Spinner } from "@/components/ui/Spinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { Badge } from "@/components/ui/Badge"
import { WeekDayBadge } from "@/components/ui/WeekDayBadge"
import { getClientAssignedDays } from "@/services/trainerService"
import type { ClientProfileExtended, AssignedDay } from "@/lib/types"

interface ClientDetailModalProps {
    isOpen: boolean
    onClose: () => void
    client: ClientProfileExtended
}

export function ClientDetailModal({ isOpen, onClose, client }: ClientDetailModalProps) {
    const [assignments, setAssignments] = useState<AssignedDay[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isOpen) return
        const controller = new AbortController()
        setIsLoading(true)
        getClientAssignedDays(client.id, controller.signal)
            .then(setAssignments)
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err)
            })
            .finally(() => setIsLoading(false))
        return () => controller.abort()
    }, [isOpen, client.id])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={client.full_name} className="!max-w-lg">
            <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-lg font-semibold text-blue-400">
                        {client.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{client.full_name}</p>
                        <p className="truncate text-sm text-muted-foreground">
                            {client.email ?? "No email"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Height: {client.height ? `${client.height}m` : "Not set"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-medium text-foreground">
                        Assigned routines ({assignments.length})
                    </p>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Spinner className="h-5 w-5" />
                        </div>
                    ) : assignments.length === 0 ? (
                        <EmptyState
                            icon={<ListPlus className="h-10 w-10" />}
                            title="No routines assigned"
                            description="This client has no routines yet"
                        />
                    ) : (
                        <div className="space-y-2">
                            {assignments.map((a) => (
                                <div
                                    key={`${a.routine_id}-${a.week_day}`}
                                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
                                >
                                    <p className="flex-1 truncate text-sm font-medium text-foreground">
                                        {a.routine_name}
                                    </p>
                                    <WeekDayBadge day={a.week_day} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}
