"use client"

import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import type { ExerciseLibraryItem } from "@/lib/types"

interface ExerciseLibraryCardProps {
    exercise: ExerciseLibraryItem
    onSelect: () => void
}

export function ExerciseLibraryCard({ exercise, onSelect }: ExerciseLibraryCardProps) {
    return (
        <button
            onClick={onSelect}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:shadow-lg"
        >
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img
                    src={exercise.image_url}
                    alt={exercise.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground capitalize">
                    {exercise.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                    <Badge variant="body_part">{exercise.body_part}</Badge>
                    {exercise.target && exercise.target !== exercise.body_part && (
                        <Badge variant="target">{exercise.target}</Badge>
                    )}
                    <Badge variant="equipment">{exercise.equipment}</Badge>
                </div>
            </div>
            <Plus className="h-5 w-5 flex-shrink-0 text-primary" />
        </button>
    )
}
