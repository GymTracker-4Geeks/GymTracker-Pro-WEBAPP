import { GET } from "./api"
import type { ExerciseLibraryItem, ExerciseLibraryFiltersData, PaginatedResponse } from "@/lib/types"

export function getExerciseLibrary(params: {
    page?: number
    per_page?: number
    search?: string
    body_part?: string
    target?: string
    equipment?: string
}): Promise<PaginatedResponse<ExerciseLibraryItem>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set("page", String(params.page))
    if (params.per_page) searchParams.set("per_page", String(params.per_page))
    if (params.search) searchParams.set("search", params.search)
    if (params.body_part) searchParams.set("body_part", params.body_part)
    if (params.target) searchParams.set("target", params.target)
    if (params.equipment) searchParams.set("equipment", params.equipment)

    const query = searchParams.toString()
    return GET<PaginatedResponse<ExerciseLibraryItem>>(
        `/api/exercise-library/${query ? `?${query}` : ""}`
    )
}

export function getExerciseLibraryFilters(): Promise<ExerciseLibraryFiltersData> {
    return GET<ExerciseLibraryFiltersData>("/api/exercise-library/filters")
}

export function getExerciseLibraryById(id: number): Promise<ExerciseLibraryItem> {
    return GET<ExerciseLibraryItem>(`/api/exercise-library/${id}`)
}
