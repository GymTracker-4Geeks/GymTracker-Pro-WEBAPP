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
}

export function ExerciseLibraryModal({
    isOpen,
    onClose,
    onSelect,
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
    const [filters, setFilters] = useState<ExerciseLibraryFiltersData>({
        body_parts: [],
        targets: [],
        equipments: [],
    })
    const [openCount, setOpenCount] = useState(0)

    useEffect(() => {
        if (!isOpen) return
        setOpenCount((c) => c + 1)
        setSearch("")
        setBodyPart("")
        setTarget("")
        setEquipment("")
        setPage(1)
        getExerciseLibraryFilters()
            .then(setFilters)
            .catch(console.error)
    }, [isOpen])

    const fetchExercises = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await getExerciseLibrary({
                page,
                per_page: 20,
                search: search || undefined,
                body_part: bodyPart || undefined,
                target: target || undefined,
                equipment: equipment || undefined,
            })
            setExercises(data.items)
            setTotalPages(data.pages)
            setHasNext(data.has_next)
            setHasPrev(data.has_prev)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [page, search, bodyPart, target, equipment])

    useEffect(() => {
        if (isOpen) {
            fetchExercises()
        }
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
                    page={page}
                    totalPages={totalPages}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    onPageChange={setPage}
                    onSelect={handleSelect}
                />
            </div>
        </Modal>
    )
}
