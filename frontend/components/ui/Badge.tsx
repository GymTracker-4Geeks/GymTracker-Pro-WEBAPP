import { cn } from "@/lib/utils"

const variants = {
    default: "bg-secondary text-secondary-foreground",
    body_part: "bg-primary/15 text-primary",
    target: "bg-blue-500/15 text-blue-400",
    equipment: "bg-emerald-500/15 text-emerald-400",
}

interface BadgeProps {
    children: React.ReactNode
    variant?: keyof typeof variants
    className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}
