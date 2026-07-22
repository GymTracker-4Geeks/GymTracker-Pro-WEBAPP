"use client"

import { useState, useEffect, useCallback } from "react"
import { Dumbbell, Search } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { ExerciseLibrarySearch } from "@/components/routines/ExerciseLibrarySearch"
import { ExerciseLibraryFilters } from "@/components/routines/ExerciseLibraryFilters"
import { ExerciseLibraryGrid } from "@/components/routines/ExerciseLibraryGrid"
import { getExerciseLibrary, getExerciseLibraryFilters } from "@/services/exerciseLibraryService"
import type { ExerciseLibraryItem, ExerciseLibraryFiltersData } from "@/lib/types"

export default function ExercisesPage() {
    const [search, setSearch] = useState("")
    const [bodyPart, setBodyPart] = useState("")
    const [target, setTarget] = useState("")
    const [equipment, setEquipment] = useState("")
    const [page, setPage] = useState(1)
    const [exercises, setExercises] = useState<ExerciseLibraryItem[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<ExerciseLibraryFiltersData>({
        body_parts: [],
        targets: [],
        equipments: [],
    })

    useEffect(() => {
        const controller = new AbortController()
        getExerciseLibraryFilters(controller.signal)
            .then(setFilters)
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err)
            })
        return () => controller.abort()
    }, [])

    const fetchExercises = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getExerciseLibrary({
                page,
                per_page: 20,
                search: search || undefined,
                body_part: bodyPart || undefined,
                target: target || undefined,
                equipment: equipment || undefined,
            }, signal)
            setExercises(data.items)
            setTotalPages(data.pages)
            setHasNext(data.has_next)
            setHasPrev(data.has_prev)
            setIsLoading(false)
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return
            setError(err instanceof Error ? err.message : "Failed to load exercises")
            setIsLoading(false)
        } 
    }, [page, search, bodyPart, target, equipment])

    useEffect(() => {
        const controller = new AbortController()
        fetchExercises(controller.signal)
        return () => controller.abort()
    }, [fetchExercises])

    const handleSearch = useCallback((value: string) => {
        setSearch(value)
        setPage(1)
    }, [])

    const handleFilterChange = useCallback(
        (newFilters: { body_part?: string; target?: string; equipment?: string }) => {
            if (newFilters.body_part !== undefined) setBodyPart(newFilters.body_part)
            if (newFilters.target !== undefined) setTarget(newFilters.target)
            if (newFilters.equipment !== undefined) setEquipment(newFilters.equipment)
            setPage(1)
        },
        []
    )

    if (isLoading && exercises.length === 0) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Exercises" subtitle="Browse the complete exercise library" />

            <div className="mb-5 space-y-4">
                <ExerciseLibrarySearch value={search} searchKey={0} onSearch={handleSearch} />
                <ExerciseLibraryFilters
                    selectedBodyPart={bodyPart}
                    selectedTarget={target}
                    selectedEquipment={equipment}
                    filters={filters}
                    onChange={handleFilterChange}
                />
            </div>

            {error && exercises.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="mb-4 h-12 w-12 text-destructive/30" aria-hidden="true" />
                    <p className="text-sm font-medium text-destructive">{error}</p>
                    <button
                        onClick={() => fetchExercises()}
                        className="mt-3 text-sm font-medium text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <ExerciseLibraryGrid
                    exercises={exercises}
                    isLoading={isLoading}
                    error={error}
                    page={page}
                    totalPages={totalPages}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    selectedIds={new Set()}
                    onPageChange={setPage}
                    onSelect={() => {}}
                />
            )}
        </div>
    )
}
