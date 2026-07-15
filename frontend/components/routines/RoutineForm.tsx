"use client"

import { useState, useCallback, useMemo } from "react"
import { Plus, Save } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Spinner } from "@/components/ui/Spinner"
import { Toast } from "@/components/ui/Toast"
import { RoutineExercises } from "@/components/routines/RoutineExercises"
import { ExerciseLibraryModal } from "@/components/routines/ExerciseLibraryModal"
import { createRoutine, editRoutine } from "@/services/routineService"
import { addExerciseToRoutine, deleteExercise } from "@/services/exerciseService"
import { cn } from "@/lib/utils"
import type { ExerciseLibraryItem, SelectedExercise, ExerciseConfig, RoutineProfile } from "@/lib/types"

const WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

const DEFAULT_CONFIG: ExerciseConfig = {
    sets: 3,
    reps: 10,
    rir: 1,
    restTime: 60,
    notes: "",
    order: 0,
}

function mapRoutineToExercises(routine: RoutineProfile): SelectedExercise[] {
    return routine.exercises.map((ex) => ({
        tempId: crypto.randomUUID(),
        libraryExerciseId: ex.library_exercise_id ?? 0,
        exerciseId: ex.id,
        name: ex.name,
        bodyPart: ex.muscle_group,
        equipment: "",
        imageUrl: "",
        config: {
            sets: ex.sets,
            reps: ex.reps,
            rir: 1,
            restTime: 60,
            notes: "",
            order: 0,
        },
    }))
}

function LoadingSkeleton() {
    return (
        <div className="mx-auto max-w-3xl space-y-6" aria-hidden="true">
            <div className="rounded-2xl border border-border bg-card p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="flex gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-12" />
                    ))}
                </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface RoutineFormProps {
    routine?: RoutineProfile
    onCancel?: () => void
    onSaved?: () => void
}

export function RoutineForm({ routine, onCancel, onSaved }: RoutineFormProps) {
    const [name, setName] = useState(routine?.name ?? "")
    const [nameTouched, setNameTouched] = useState(false)
    const [description, setDescription] = useState(routine?.description ?? "")
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
        routine ? mapRoutineToExercises(routine) : []
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        )
    }

    const selectedExerciseIds = useMemo(
        () => new Set(selectedExercises.map((ex) => ex.libraryExerciseId).filter(Boolean)),
        [selectedExercises]
    )

    const handleSelectExercise = useCallback((item: ExerciseLibraryItem) => {
        setSelectedExercises((prev) => {
            if (prev.some((ex) => ex.libraryExerciseId === item.id)) {
                return prev
            }
            const newExercise: SelectedExercise = {
                tempId: crypto.randomUUID(),
                libraryExerciseId: item.id,
                exerciseId: null,
                name: item.name,
                bodyPart: item.body_part,
                equipment: item.equipment,
                imageUrl: item.image_url,
                config: {
                    ...DEFAULT_CONFIG,
                    order: prev.length,
                },
            }
            return [...prev, newExercise]
        })
        setIsModalOpen(false)
    }, [])

    const handleRemove = useCallback((index: number) => {
        setSelectedExercises((prev) => prev.filter((_, i) => i !== index))
        setEditingIndex((current) =>
            current === index ? null : current !== null && current > index ? current - 1 : current
        )
    }, [])

    const handleToggleEdit = useCallback((index: number) => {
        setEditingIndex((current) => (current === index ? null : index))
    }, [])

    const handleConfigChange = useCallback(
        (index: number, config: Partial<ExerciseConfig>) => {
            setSelectedExercises((prev) =>
                prev.map((ex, i) =>
                    i === index ? { ...ex, config: { ...ex.config, ...config } } : ex
                )
            )
        },
        []
    )

    const handleSubmit = useCallback(async () => {
        if (!name.trim()) {
            setNameTouched(true)
            return
        }

        setIsSaving(true)
        setToast(null)

        try {
            if (routine) {
                const routineId = routine.id
                await editRoutine(routineId, { name: name.trim(), description: description.trim() })

                const existingIds = selectedExercises
                    .filter((ex) => ex.exerciseId !== null)
                    .map((ex) => ex.exerciseId as number)

                for (const id of existingIds) {
                    await deleteExercise(id)
                }

                for (const ex of selectedExercises) {
                    await addExerciseToRoutine(routineId, {
                        name: ex.name,
                        sets: ex.config.sets,
                        reps: ex.config.reps,
                        muscle_group: ex.bodyPart,
                    })
                }
            } else {
                await createRoutine({
                    name: name.trim(),
                    description: description.trim(),
                    exercises: selectedExercises.map((ex) => ({
                        name: ex.name,
                        sets: ex.config.sets,
                        reps: ex.config.reps,
                        muscle_group: ex.bodyPart,
                    })),
                })
            }

            setToast({ message: "Routine saved successfully", type: "success" })
            onSaved?.()
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to save routine",
                type: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }, [name, description, selectedExercises, routine, onSaved])

    const canSave = name.trim().length > 0 && !isSaving

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground font-display">
                    Routine details
                </h2>
                <div className="space-y-4">
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            if (!nameTouched) setNameTouched(true)
                        }}
                        onBlur={() => setNameTouched(true)}
                        placeholder="e.g. Push Day A"
                        error={nameTouched && !name.trim() ? "Name is required" : undefined}
                        required
                    />
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of this routine..."
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground font-display">
                    Training days
                </h2>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Select training days">
                    {WEEK_DAYS.map((day) => {
                        const isSelected = selectedDays.includes(day)
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                aria-pressed={isSelected}
                                aria-label={day}
                                className={cn(
                                    "rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                    isSelected
                                        ? "border-primary bg-primary/15 text-primary"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                )}
                            >
                                {day.slice(0, 3)}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground font-display">
                        Exercises ({selectedExercises.length})
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Add exercise from library"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add exercise
                    </button>
                </div>
                <RoutineExercises
                    exercises={selectedExercises}
                    editingIndex={editingIndex}
                    onRemove={handleRemove}
                    onToggleEdit={handleToggleEdit}
                    onConfigChange={handleConfigChange}
                />
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={handleSubmit}
                    disabled={!canSave}
                    aria-label={isSaving ? "Saving routine" : "Save routine"}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white",
                        canSave
                            ? "gradient-red glow-red"
                            : "cursor-not-allowed bg-secondary text-muted-foreground"
                    )}
                >
                    {isSaving ? (
                        <>
                            <Spinner className="h-4 w-4" aria-hidden="true" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" aria-hidden="true" />
                            Save routine
                        </>
                    )}
                </Button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <ExerciseLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectExercise}
                selectedIds={selectedExerciseIds}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
