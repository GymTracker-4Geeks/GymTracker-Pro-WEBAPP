"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface SheetProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Sheet({ isOpen, onClose, children }: SheetProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
            document.body.style.overflow = "hidden"
        } else {
            setVisible(false)
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50">
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    visible ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-transform duration-300",
                    visible ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}
