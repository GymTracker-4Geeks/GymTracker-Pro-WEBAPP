"use client"

import { ListPlus } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"
import { RoutineExerciseCard } from "@/components/routines/RoutineExerciseCard"
import type { SelectedExercise, ExerciseConfig } from "@/lib/types"

interface RoutineExercisesProps {
    exercises: SelectedExercise[]
    editingIndex: number | null
    onRemove: (index: number) => void
    onToggleEdit: (index: number) => void
    onConfigChange: (index: number, config: Partial<ExerciseConfig>) => void
}

export function RoutineExercises({
    exercises,
    editingIndex,
    onRemove,
    onToggleEdit,
    onConfigChange,
}: RoutineExercisesProps) {
    if (exercises.length === 0) {
        return (
            <EmptyState
                icon={<ListPlus className="h-12 w-12" />}
                title="No exercises added"
                description='Click "Add Exercise" to search the library'
            />
        )
    }

    return (
        <div className="space-y-3">
            {exercises.map((exercise, index) => (
                <RoutineExerciseCard
                    key={exercise.tempId}
                    exercise={exercise}
                    index={index}
                    isEditing={editingIndex === index}
                    onRemove={() => onRemove(index)}
                    onToggleEdit={() => onToggleEdit(index)}
                    onConfigChange={(config) => onConfigChange(index, config)}
                />
            ))}
        </div>
    )
}
