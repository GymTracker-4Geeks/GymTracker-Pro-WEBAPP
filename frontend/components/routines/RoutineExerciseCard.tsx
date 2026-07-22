"use client"

import { ChevronDown, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { ExerciseConfigurationForm } from "@/components/routines/ExerciseConfigurationForm"
import { cn } from "@/lib/utils"
import type { SelectedExercise, ExerciseConfig } from "@/lib/types"

interface RoutineExerciseCardProps {
    exercise: SelectedExercise
    isEditing: boolean
    onRemove: () => void
    onToggleEdit: () => void
    onConfigChange: (config: Partial<ExerciseConfig>) => void
}

export function RoutineExerciseCard({
    exercise,
    isEditing,
    onRemove,
    onToggleEdit,
    onConfigChange,
}: RoutineExerciseCardProps) {
    return (
        <div className="animate-fade-in rounded-xl border border-border bg-card transition-all hover:border-primary/30">
            <div className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-secondary" aria-hidden="true">
                    <img
                        src={exercise.imageUrl || undefined}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground capitalize">
                        {exercise.name}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {exercise.bodyPart && (
                            <Badge variant="body_part">{exercise.bodyPart}</Badge>
                        )}
                        {exercise.equipment && (
                            <Badge variant="equipment">{exercise.equipment}</Badge>
                        )}
                    </div>
                </div>
                <span className="text-xs text-muted-foreground" aria-label={`${exercise.config.sets} sets of ${exercise.config.reps} reps`}>
                    {exercise.config.sets}x{exercise.config.reps}
                </span>
                <button
                    onClick={onToggleEdit}
                    aria-label={isEditing ? "Collapse configuration" : "Edit configuration"}
                    className={cn(
                        "rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        isEditing && "rotate-180 bg-accent text-foreground"
                    )}
                >
                    <ChevronDown className="h-4 w-4 transition-transform" aria-hidden="true" />
                </button>
                <button
                    onClick={onRemove}
                    aria-label={`Remove ${exercise.name}`}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/15 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
            {isEditing && (
                <div className="border-t border-border px-4 pb-4 animate-fade-in">
                    <ExerciseConfigurationForm
                        config={exercise.config}
                        onChange={onConfigChange}
                    />
                </div>
            )}
        </div>
    )
}
