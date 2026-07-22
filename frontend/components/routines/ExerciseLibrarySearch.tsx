"use client"

import { SearchInput } from "@/components/ui/SearchInput"

interface ExerciseLibrarySearchProps {
    value: string
    onSearch: (value: string) => void
    searchKey: number
}

export function ExerciseLibrarySearch({ value, onSearch, searchKey }: ExerciseLibrarySearchProps) {
    return (
        <SearchInput
            key={searchKey}
            value={value}
            onChange={onSearch}
            placeholder="Search exercises by name..."
            debounceMs={300}
        />
    )
}
