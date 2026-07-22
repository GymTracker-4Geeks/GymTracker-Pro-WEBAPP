"use client"

import { Eye, Trash2 } from "lucide-react"
import { DropdownMenu } from "@/components/ui/DropdownMenu"
import { Badge } from "@/components/ui/Badge"
import type { ClientProfileExtended } from "@/lib/types"

interface ClientCardProps {
    client: ClientProfileExtended
    onSelect: () => void
    onRemove: () => void
}

export function ClientCard({ client, onSelect, onRemove }: ClientCardProps) {
    return (
        <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
            <div className="h-20 bg-gradient-to-br from-blue-600/80 to-blue-500 relative">
                <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                    {client.routine_ids?.length ?? 0} routines
                </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground">
                            {client.full_name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                            {client.email ?? "No email"}
                        </p>
                    </div>
                    <DropdownMenu
                        items={[
                            {
                                label: "View details",
                                icon: <Eye className="h-4 w-4" />,
                                onClick: onSelect,
                            },
                            {
                                label: "Remove",
                                icon: <Trash2 className="h-4 w-4" />,
                                onClick: onRemove,
                                variant: "destructive",
                            },
                        ]}
                    />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {client.height ? (
                        <Badge variant="default">{client.height}m</Badge>
                    ) : (
                        <Badge variant="default">No height</Badge>
                    )}
                    <Badge variant="body_part">
                        {client.routine_ids?.length ?? 0} routine{(client.routine_ids?.length ?? 0) !== 1 ? "s" : ""}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
