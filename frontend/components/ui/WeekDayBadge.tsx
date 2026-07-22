import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

const DAY_COLORS: Record<string, string> = {
    Monday: "border-blue-500/20 bg-blue-500/15 text-blue-400",
    Tuesday: "border-emerald-500/20 bg-emerald-500/15 text-emerald-400",
    Wednesday: "border-amber-500/20 bg-amber-500/15 text-amber-400",
    Thursday: "border-purple-500/20 bg-purple-500/15 text-purple-400",
    Friday: "border-red-500/20 bg-red-500/15 text-red-400",
    Saturday: "border-orange-500/20 bg-orange-500/15 text-orange-400",
    Sunday: "border-gray-500/20 bg-gray-500/15 text-gray-400",
}

interface WeekDayBadgeProps {
    day: string
}

export function WeekDayBadge({ day }: WeekDayBadgeProps) {
    const color = DAY_COLORS[day] ?? DAY_COLORS.Monday

    return (
        <Badge className={cn("border", color)}>
            {day.slice(0, 3)}
        </Badge>
    )
}
