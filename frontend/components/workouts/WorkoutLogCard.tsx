"use client"

import { Pencil, Trash2 } from "lucide-react"
import { DropdownMenu } from "@/components/ui/DropdownMenu"
import { Badge } from "@/components/ui/Badge"
import type { WorkoutLogEntry } from "@/lib/types"

interface WorkoutLogCardProps {
    log: WorkoutLogEntry
    onEdit: () => void
    onDelete: () => void
}

export function WorkoutLogCard({ log, onEdit, onDelete }: WorkoutLogCardProps) {
    const date = new Date(log.performed_at)
    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    })

    return (
        <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
            <div className="h-2 bg-gradient-to-r from-emerald-600 to-emerald-400" />
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground capitalize">
                            {log.exercise_name ?? "Unknown exercise"}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {formattedDate} at {formattedTime}
                        </p>
                    </div>
                    <DropdownMenu
                        items={[
                            {
                                label: "Edit",
                                icon: <Pencil className="h-4 w-4" />,
                                onClick: onEdit,
                            },
                            {
                                label: "Delete",
                                icon: <Trash2 className="h-4 w-4" />,
                                onClick: onDelete,
                                variant: "destructive",
                            },
                        ]}
                    />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="default">
                        {log.weight} kg
                    </Badge>
                    <Badge variant="body_part">
                        {log.reps} reps
                    </Badge>
                    <Badge variant="equipment">
                        {log.sets} set{log.sets !== 1 ? "s" : ""}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
