"use client"

import { Dumbbell, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { Pagination } from "@/components/ui/Pagination"
import { ExerciseLibraryCard } from "@/components/routines/ExerciseLibraryCard"
import type { ExerciseLibraryItem } from "@/lib/types"

interface ExerciseLibraryGridProps {
    exercises: ExerciseLibraryItem[]
    isLoading: boolean
    error: string | null
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    selectedIds: Set<number>
    onPageChange: (page: number) => void
    onSelect: (exercise: ExerciseLibraryItem) => void
}

function LoadingSkeleton() {
    return (
        <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4"
                >
                    <Skeleton className="h-14 w-14 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-1">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <EmptyState
            icon={<AlertCircle className="h-12 w-12" />}
            title="Failed to load exercises"
            description={message}
        />
    )
}

export function ExerciseLibraryGrid({
    exercises,
    isLoading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    selectedIds,
    onPageChange,
    onSelect,
}: ExerciseLibraryGridProps) {
    if (error && exercises.length === 0) {
        return <ErrorState message={error} />
    }

    if (isLoading && exercises.length === 0) {
        return <LoadingSkeleton />
    }

    if (!isLoading && exercises.length === 0) {
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
                        isSelected={selectedIds.has(exercise.id)}
                        onSelect={() => onSelect(exercise)}
                    />
                ))}
            </div>
            {isLoading && (
                <div className="flex justify-center py-4">
                    <Skeleton className="h-5 w-5 animate-spin rounded-full" />
                </div>
            )}
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
