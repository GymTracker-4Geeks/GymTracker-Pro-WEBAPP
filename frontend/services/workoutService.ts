import { GET, POST, PATCH, DELETE } from "./api"
import type {
    WorkoutLogEntry,
    CreateWorkoutLogResponse,
    UpdateWorkoutLogResponse,
    MessageResponse,
} from "@/lib/types"

export const getWorkoutLogs = async (signal?: AbortSignal): Promise<WorkoutLogEntry[]> =>
    GET<WorkoutLogEntry[]>("/api/workouts", signal)

export const createWorkoutLog = async (data: {
    exercise_id: number
    weight: number
    reps: number
    sets?: number
}): Promise<CreateWorkoutLogResponse> =>
    POST<CreateWorkoutLogResponse, typeof data>("/api/workouts", data)

export const updateWorkoutLog = async (
    id: number,
    data: { weight?: number; reps?: number; sets?: number }
): Promise<UpdateWorkoutLogResponse> =>
    PATCH<UpdateWorkoutLogResponse, typeof data>(`/api/workouts/${id}`, data)

export const deleteWorkoutLog = async (id: number): Promise<MessageResponse> =>
    DELETE<MessageResponse>(`/api/workouts/${id}`)
