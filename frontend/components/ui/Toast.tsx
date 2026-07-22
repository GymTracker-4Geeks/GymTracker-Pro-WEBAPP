"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
    message: string
    type: "success" | "error"
    onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div
            role="alert"
            aria-live="polite"
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur animate-fade-in-up",
                type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
            )}
        >
            {type === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            )}
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                aria-label="Dismiss notification"
                className="ml-2 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
                <X className="h-4 w-4" aria-hidden="true" />
            </button>
        </div>
    )
}
