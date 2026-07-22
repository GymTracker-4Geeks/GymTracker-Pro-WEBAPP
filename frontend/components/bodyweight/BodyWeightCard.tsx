"use client"

import { Pencil, Trash2 } from "lucide-react"
import { DropdownMenu } from "@/components/ui/DropdownMenu"
import { Badge } from "@/components/ui/Badge"
import type { BodyWeightRecord } from "@/lib/types"

interface BodyWeightCardProps {
    weight: BodyWeightRecord
    onEdit: () => void
    onDelete: () => void
}

export function BodyWeightCard({ weight: record, onEdit, onDelete }: BodyWeightCardProps) {
    const date = new Date(record.recorded_at)
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
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-3xl font-bold tracking-tight text-foreground">
                            {record.weight}
                            <span className="ml-1 text-lg font-medium text-muted-foreground">kg</span>
                        </p>
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
            </div>
        </div>
    )
}
