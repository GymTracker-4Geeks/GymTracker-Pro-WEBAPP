"use client"

import { useState, useEffect, useRef } from "react"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownMenuItem {
    label: string
    icon: React.ReactNode
    onClick: () => void
    variant?: "default" | "destructive"
}

interface DropdownMenuProps {
    items: DropdownMenuItem[]
    trigger?: React.ReactNode
}

export function DropdownMenu({ items, trigger }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen])

    const handleItemClick = (item: DropdownMenuItem) => {
        setIsOpen(false)
        item.onClick()
    }

    return (
        <div ref={menuRef} className="relative inline-block">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="More options"
                aria-expanded={isOpen}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
                {trigger ?? <MoreVertical className="h-4 w-4" />}
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute right-0 top-full z-40 mt-1 min-w-[160px] animate-fade-in rounded-lg border border-border bg-card p-1 shadow-lg"
                    )}
                >
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => handleItemClick(item)}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                                item.variant === "destructive"
                                    ? "text-destructive hover:bg-destructive/10"
                                    : "text-foreground hover:bg-accent"
                            )}
                        >
                            <span className="h-4 w-4 flex-shrink-0">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
