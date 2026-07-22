import { cn } from "@/lib/utils"

export function Button({ children, className , ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={cn('rounded-lg bg-primary px-4 py-2 text-white',  className)}{...props}>
            {children}
        </button>
    );
}