import { GET, POST, DELETE } from "./api"
import type { ExerciseProfile, MessageResponse } from "@/lib/types"

export const getExercises = async (): Promise<ExerciseProfile[]> => {
    return GET<ExerciseProfile[]>("/api/exercises/")
}

interface AddExercisePayload {
    name: string
    sets: number
    reps: number
    muscle_group: string
}

export const addExerciseToRoutine = async (
    routineId: number,
    data: AddExercisePayload
): Promise<{ message: string; exercise: ExerciseProfile }> => {
    return POST<{ message: string; exercise: ExerciseProfile }, AddExercisePayload>(
        `/api/exercises/routines/${routineId}`,
        data
    )
}

export const deleteExercise = async (exerciseId: number): Promise<MessageResponse> => {
    return DELETE<MessageResponse>(`/api/exercises/${exerciseId}`)
}
