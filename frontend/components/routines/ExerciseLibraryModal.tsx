"use client"

import { useState, useEffect, useCallback } from "react"
import { Modal } from "@/components/ui/Modal"
import { ExerciseLibrarySearch } from "@/components/routines/ExerciseLibrarySearch"
import { ExerciseLibraryFilters } from "@/components/routines/ExerciseLibraryFilters"
import { ExerciseLibraryGrid } from "@/components/routines/ExerciseLibraryGrid"
import {
    getExerciseLibrary,
    getExerciseLibraryFilters,
} from "@/services/exerciseLibraryService"
import type {
    ExerciseLibraryItem,
    ExerciseLibraryFiltersData,
} from "@/lib/types"

interface ExerciseLibraryModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (exercise: ExerciseLibraryItem) => void
    selectedIds: Set<number>
}

export function ExerciseLibraryModal({
    isOpen,
    onClose,
    onSelect,
    selectedIds,
}: ExerciseLibraryModalProps) {
    const [search, setSearch] = useState("")
    const [bodyPart, setBodyPart] = useState("")
    const [target, setTarget] = useState("")
    const [equipment, setEquipment] = useState("")
    const [page, setPage] = useState(1)
    const [exercises, setExercises] = useState<ExerciseLibraryItem[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<ExerciseLibraryFiltersData>({
        body_parts: [],
        targets: [],
        equipments: [],
    })
    const [openCount, setOpenCount] = useState(0)

    useEffect(() => {
        if (!isOpen) return
        const controller = new AbortController()
        setOpenCount((c) => c + 1)
        setSearch("")
        setBodyPart("")
        setTarget("")
        setEquipment("")
        setPage(1)
        setError(null)
        setExercises([])
        getExerciseLibraryFilters(controller.signal)
            .then(setFilters)
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err)
            })
        return () => controller.abort()
    }, [isOpen])

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
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return
            setError(err instanceof Error ? err.message : "Failed to load exercises")
        } finally {
            setIsLoading(false)
        }
    }, [page, search, bodyPart, target, equipment])

    useEffect(() => {
        const controller = new AbortController()
        if (isOpen) {
            fetchExercises(controller.signal)
        }
        return () => controller.abort()
    }, [isOpen, fetchExercises])

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

    const handleSelect = useCallback(
        (exercise: ExerciseLibraryItem) => {
            onSelect(exercise)
            onClose()
        },
        [onSelect, onClose]
    )

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Exercise Library">
            <div className="space-y-4">
                <ExerciseLibrarySearch value={search} searchKey={openCount} onSearch={handleSearch} />
                <ExerciseLibraryFilters
                    selectedBodyPart={bodyPart}
                    selectedTarget={target}
                    selectedEquipment={equipment}
                    filters={filters}
                    onChange={handleFilterChange}
                />
                <ExerciseLibraryGrid
                    exercises={exercises}
                    isLoading={isLoading}
                    error={error}
                    page={page}
                    totalPages={totalPages}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    selectedIds={selectedIds}
                    onPageChange={setPage}
                    onSelect={handleSelect}
                />
            </div>
        </Modal>
    )
}
