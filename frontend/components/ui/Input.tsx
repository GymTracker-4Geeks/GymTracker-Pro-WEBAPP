import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>
            <input
                className={cn(
                    "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm",
                    "text-foreground placeholder:text-muted-foreground",
                    "outline-none transition-colors",
                    "focus:border-primary/60 focus:ring-1 focus:ring-primary/30",
                    error && "border-destructive",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}
