"use client"

import { useEffect, useCallback, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        },
        [onClose]
    )

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = ""
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
                    visible ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative z-10 w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl transition-all duration-200",
                    visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
                    className
                )}
            >
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-lg font-semibold text-foreground font-display">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
