import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
    placeholder?: string
}

export function Select({ label, value, options, onChange, placeholder }: SelectProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-10 text-sm",
                        "text-foreground outline-none transition-colors",
                        "focus:border-primary/60 focus:ring-1 focus:ring-primary/30",
                        !value && "text-muted-foreground"
                    )}
                >
                    {placeholder && (
                        <option value="">{placeholder}</option>
                    )}
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
        </div>
    )
}
