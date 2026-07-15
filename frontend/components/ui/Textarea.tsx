import { cn } from "@/lib/utils"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>
            <textarea
                className={cn(
                    "min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
                    "text-foreground placeholder:text-muted-foreground",
                    "outline-none transition-colors resize-vertical",
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
