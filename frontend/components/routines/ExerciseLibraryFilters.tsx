"use client"

import { Select } from "@/components/ui/Select"
import type { ExerciseLibraryFiltersData } from "@/lib/types"

interface ExerciseLibraryFiltersProps {
    selectedBodyPart: string
    selectedTarget: string
    selectedEquipment: string
    filters: ExerciseLibraryFiltersData
    onChange: (filters: { body_part?: string; target?: string; equipment?: string }) => void
}

export function ExerciseLibraryFilters({
    selectedBodyPart,
    selectedTarget,
    selectedEquipment,
    filters,
    onChange,
}: ExerciseLibraryFiltersProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            <Select
                label="Body part"
                value={selectedBodyPart}
                options={filters.body_parts}
                onChange={(value) => onChange({ body_part: value })}
                placeholder="All body parts"
            />
            <Select
                label="Target"
                value={selectedTarget}
                options={filters.targets}
                onChange={(value) => onChange({ target: value })}
                placeholder="All targets"
            />
            <Select
                label="Equipment"
                value={selectedEquipment}
                options={filters.equipments}
                onChange={(value) => onChange({ equipment: value })}
                placeholder="All equipment"
            />
        </div>
    )
}
