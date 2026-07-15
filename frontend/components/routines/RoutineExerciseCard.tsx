"use client"

import { ChevronDown, GripVertical, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { ExerciseConfigurationForm } from "@/components/routines/ExerciseConfigurationForm"
import { cn } from "@/lib/utils"
import type { SelectedExercise, ExerciseConfig } from "@/lib/types"

interface RoutineExerciseCardProps {
    exercise: SelectedExercise
    index: number
    isEditing: boolean
    onRemove: () => void
    onToggleEdit: () => void
    onConfigChange: (config: Partial<ExerciseConfig>) => void
}

export function RoutineExerciseCard({
    exercise,
    index,
    isEditing,
    onRemove,
    onToggleEdit,
    onConfigChange,
}: RoutineExerciseCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card transition-all hover:border-primary/30">
            <div className="flex items-center gap-3 p-4">
                <GripVertical className="h-5 w-5 flex-shrink-0 text-muted-foreground/50" />
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground capitalize">
                        {exercise.name}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="body_part">{exercise.bodyPart}</Badge>
                        <Badge variant="equipment">{exercise.equipment}</Badge>
                    </div>
                </div>
                <span className="text-xs text-muted-foreground">
                    {exercise.config.sets}x{exercise.config.reps}
                </span>
                <button
                    onClick={onToggleEdit}
                    className={cn(
                        "rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
                        isEditing && "rotate-180 bg-accent text-foreground"
                    )}
                >
                    <ChevronDown className="h-4 w-4 transition-transform" />
                </button>
                <button
                    onClick={onRemove}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/15 hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
            {isEditing && (
                <div className="border-t border-border px-4 pb-4">
                    <ExerciseConfigurationForm
                        config={exercise.config}
                        onChange={onConfigChange}
                    />
                </div>
            )}
        </div>
    )
}
