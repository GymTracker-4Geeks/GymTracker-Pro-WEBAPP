import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, hasNext, hasPrev, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between pt-4">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!hasPrev}
                className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    hasPrev
                        ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                        : "cursor-not-allowed text-muted-foreground/40"
                )}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </button>
            <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!hasNext}
                className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    hasNext
                        ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                        : "cursor-not-allowed text-muted-foreground/40"
                )}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}
