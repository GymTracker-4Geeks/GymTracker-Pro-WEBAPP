"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Modal } from "@/components/ui/Modal"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import { createWorkoutLog, updateWorkoutLog } from "@/services/workoutService"
import { getClientRoutines } from "@/services/routineService"
import type { WorkoutLogEntry, RoutineExercise } from "@/lib/types"

interface WorkoutLogFormModalProps {
    isOpen: boolean
    onClose: () => void
    mode: "create" | "edit"
    log?: WorkoutLogEntry
    onSaved: (log: WorkoutLogEntry) => void
}

export function WorkoutLogFormModal({
    isOpen,
    onClose,
    mode,
    log,
    onSaved,
}: WorkoutLogFormModalProps) {
    const [exerciseId, setExerciseId] = useState("")
    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")
    const [sets, setSets] = useState("1")
    const [exercises, setExercises] = useState<RoutineExercise[]>([])
    const [isLoadingExercises, setIsLoadingExercises] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) return
        const controller = new AbortController()

        if (mode === "create") {
            setExerciseId("")
            setWeight("")
            setReps("")
            setSets("1")
        } else if (log) {
            setExerciseId(String(log.exercise_id))
            setWeight(String(log.weight))
            setReps(String(log.reps))
            setSets(String(log.sets))
        }

        setError(null)
        setIsLoadingExercises(true)
        getClientRoutines()
            .then((data) => {
                const allExercises: RoutineExercise[] = []
                if (data.routines) {
                    for (const routine of data.routines) {
                        allExercises.push(...routine.exercises)
                    }
                }
                setExercises(allExercises)
            })
            .catch(console.error)
            .finally(() => setIsLoadingExercises(false))

        return () => controller.abort()
    }, [isOpen, mode, log])

    const exerciseOptions = useMemo(() => {
        const seen = new Set<number>()
        return exercises
            .filter((ex) => {
                if (seen.has(ex.id)) return false
                seen.add(ex.id)
                return true
            })
            .map((ex) => `${ex.id}`)
    }, [exercises])

    const exerciseLabels = useMemo(() => {
        const labels: Record<string, string> = {}
        exercises.forEach((ex) => {
            labels[`${ex.id}`] = ex.name
        })
        return labels
    }, [exercises])

    const handleSubmit = useCallback(async () => {
        if (!exerciseId) {
            setError("Please select an exercise")
            return
        }
        if (!weight || Number(weight) <= 0) {
            setError("Weight must be positive")
            return
        }
        if (!reps || Number(reps) <= 0) {
            setError("Reps must be positive")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            if (mode === "create") {
                const data = await createWorkoutLog({
                    exercise_id: Number(exerciseId),
                    weight: Number(weight),
                    reps: Number(reps),
                    sets: Number(sets) || 1,
                })
                onSaved(data.workout_log)
            } else if (log) {
                const data = await updateWorkoutLog(log.id, {
                    weight: Number(weight),
                    reps: Number(reps),
                    sets: Number(sets) || 1,
                })
                onSaved(data.workout_log)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save")
        } finally {
            setIsSubmitting(false)
        }
    }, [exerciseId, weight, reps, sets, mode, log, onSaved])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === "create" ? "Log Workout" : "Edit Workout"}
            className="!max-w-md"
        >
            <div className="space-y-4">
                {isLoadingExercises ? (
                    <div className="flex justify-center py-8">
                        <Spinner className="h-6 w-6" />
                    </div>
                ) : (
                    <>
                        {mode === "create" ? (
                            <Select
                                label="Exercise"
                                value={exerciseId}
                                options={exerciseOptions}
                                labels={exerciseLabels}
                                onChange={setExerciseId}
                                placeholder="Select an exercise"
                            />
                        ) : (
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground">
                                    Exercise
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    {log?.exercise_name ?? `Exercise #${log?.exercise_id}`}
                                </p>
                            </div>
                        )}

                        <Input
                            label="Weight (kg)"
                            type="number"
                            min={0}
                            step="0.5"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g. 80"
                        />
                        <Input
                            label="Reps"
                            type="number"
                            min={1}
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            placeholder="e.g. 10"
                        />
                        <Input
                            label="Sets"
                            type="number"
                            min={1}
                            value={sets}
                            onChange={(e) => setSets(e.target.value)}
                            placeholder="e.g. 3"
                        />

                        {error && (
                            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="gradient-red glow-red inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="h-4 w-4" />
                                        Saving...
                                    </>
                                ) : mode === "create" ? (
                                    "Save"
                                ) : (
                                    "Update"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
