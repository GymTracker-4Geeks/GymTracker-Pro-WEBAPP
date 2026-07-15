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
        <nav className="flex items-center justify-between pt-4" aria-label="Exercise pagination">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!hasPrev}
                aria-label="Previous page"
                className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    hasPrev
                        ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                        : "cursor-not-allowed text-muted-foreground/40"
                )}
            >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
            </button>
            <span className="text-sm text-muted-foreground" aria-current="page">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!hasNext}
                aria-label="Next page"
                className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    hasNext
                        ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                        : "cursor-not-allowed text-muted-foreground/40"
                )}
            >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
        </nav>
    )
}
