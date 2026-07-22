import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: React.ReactNode
    title: string
    description: string
    className?: string
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16", className)}>
            <div className="mb-4 text-muted-foreground/50">
                {icon}
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
