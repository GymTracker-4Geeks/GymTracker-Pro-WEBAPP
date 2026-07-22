"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    debounceMs?: number
    className?: string
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 300,
    className,
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value)
    const debouncedValue = useDebounce(localValue, debounceMs)

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    useEffect(() => {
        onChange(debouncedValue)
    }, [debouncedValue])

    return (
        <div className={cn("relative", className)}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className={cn(
                    "h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm",
                    "text-foreground placeholder:text-muted-foreground",
                    "outline-none transition-colors",
                    "focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                )}
            />
        </div>
    )
}
