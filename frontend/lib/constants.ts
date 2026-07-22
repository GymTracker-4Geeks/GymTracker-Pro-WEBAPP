import type { ExerciseConfig } from "./types"

export const WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const

export const DEFAULT_EXERCISE_CONFIG: ExerciseConfig = {
    sets: 3,
    reps: 10,
    rir: 1,
    restTime: 60,
    notes: "",
    order: 0,
}
