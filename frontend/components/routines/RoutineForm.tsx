"use client"

import { useState, useCallback, useMemo } from "react"
import { Plus, Save } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { Toast } from "@/components/ui/Toast"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { RoutineExercises } from "@/components/routines/RoutineExercises"
import { ExerciseLibraryModal } from "@/components/routines/ExerciseLibraryModal"
import { createRoutine, editRoutine } from "@/services/routineService"
import { addExerciseToRoutine, deleteExercise } from "@/services/exerciseService"
import { cn } from "@/lib/utils"
import { DEFAULT_EXERCISE_CONFIG } from "@/lib/constants"
import type { ExerciseLibraryItem, SelectedExercise, ExerciseConfig, RoutineProfile } from "@/lib/types"

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

interface RoutineFormProps {
    routine?: RoutineProfile
    onCancel?: () => void
    onSaved?: () => void
}

export function RoutineForm({ routine, onCancel, onSaved }: RoutineFormProps) {
    const [name, setName] = useState(routine?.name ?? "")
    const [nameTouched, setNameTouched] = useState(false)
    const [description, setDescription] = useState(routine?.description ?? "")
    const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
        routine ? mapRoutineToExercises(routine) : []
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [removeExerciseIndex, setRemoveExerciseIndex] = useState<number | null>(null)

    const selectedExerciseIds = useMemo(
        () => new Set(selectedExercises.map((ex) => ex.libraryExerciseId).filter((id) => id != null)),
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
                    ...DEFAULT_EXERCISE_CONFIG,
                    order: prev.length,
                },
            }
            return [...prev, newExercise]
        })
        setIsModalOpen(false)
    }, [])

    const handleRemove = useCallback((index: number) => {
        setRemoveExerciseIndex(index)
    }, [])

    const handleConfirmRemove = useCallback(() => {
        if (removeExerciseIndex === null) return
        const index = removeExerciseIndex
        setSelectedExercises((prev) => prev.filter((_, i) => i !== index))
        setEditingIndex((current) =>
            current === index ? null : current !== null && current > index ? current - 1 : current
        )
        setRemoveExerciseIndex(null)
    }, [removeExerciseIndex])

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

                const allOriginalIds = routine.exercises.map((ex) => ex.id)

                for (const id of allOriginalIds) {
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

            <ConfirmDialog
                isOpen={removeExerciseIndex !== null}
                onClose={() => setRemoveExerciseIndex(null)}
                onConfirm={handleConfirmRemove}
                title="Remove exercise"
                message={`Remove "${selectedExercises[removeExerciseIndex ?? -1]?.name ?? "this exercise"}" from this routine?`}
                confirmLabel="Remove"
                cancelLabel="Cancel"
                variant="destructive"
            />
        </div>
    )
}
