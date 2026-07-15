import { ExerciseProfile } from "@/lib/types";
import { GET, } from "./api";

export const getExercises = async (): Promise<ExerciseProfile> => {
    return GET<ExerciseProfile>("/api/exercises/");
};
