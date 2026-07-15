"use client"

import { Check } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import type { ExerciseLibraryItem } from "@/lib/types"

interface ExerciseLibraryCardProps {
    exercise: ExerciseLibraryItem
    isSelected: boolean
    onSelect: () => void
}

export function ExerciseLibraryCard({ exercise, isSelected, onSelect }: ExerciseLibraryCardProps) {
    return (
        <button
            onClick={isSelected ? undefined : onSelect}
            disabled={isSelected}
            aria-label={isSelected ? `${exercise.name} already added` : `Add ${exercise.name}`}
            className={cn(
                "flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isSelected
                    ? "cursor-not-allowed opacity-60"
                    : "hover:border-primary/40 hover:shadow-lg"
            )}
        >
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary" aria-hidden="true">
                <img
                    src={exercise.image_url}
                    alt=""
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
                    {isSelected && (
                        <Badge variant="default">Added</Badge>
                    )}
                </div>
            </div>
            {isSelected ? (
                <Check className="h-5 w-5 flex-shrink-0 text-emerald-400" aria-hidden="true" />
            ) : (
                <svg
                    className="h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                </svg>
            )}
        </button>
    )
}
