"use client"

import { Dumbbell } from "lucide-react"
import { Spinner } from "@/components/ui/Spinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { Pagination } from "@/components/ui/Pagination"
import { ExerciseLibraryCard } from "@/components/routines/ExerciseLibraryCard"
import type { ExerciseLibraryItem } from "@/lib/types"

interface ExerciseLibraryGridProps {
    exercises: ExerciseLibraryItem[]
    isLoading: boolean
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    onPageChange: (page: number) => void
    onSelect: (exercise: ExerciseLibraryItem) => void
}

export function ExerciseLibraryGrid({
    exercises,
    isLoading,
    page,
    totalPages,
    hasNext,
    hasPrev,
    onPageChange,
    onSelect,
}: ExerciseLibraryGridProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <Spinner className="h-8 w-8" />
            </div>
        )
    }

    if (exercises.length === 0) {
        return (
            <EmptyState
                icon={<Dumbbell className="h-12 w-12" />}
                title="No exercises found"
                description="Try adjusting your search or filters"
            />
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
                {exercises.map((exercise) => (
                    <ExerciseLibraryCard
                        key={exercise.id}
                        exercise={exercise}
                        onSelect={() => onSelect(exercise)}
                    />
                ))}
            </div>
            <Pagination
                page={page}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onPageChange={onPageChange}
            />
        </div>
    )
}
