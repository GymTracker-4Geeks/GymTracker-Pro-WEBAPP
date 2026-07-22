"use client"

import { Modal } from "@/components/ui/Modal"
import { Spinner } from "@/components/ui/Spinner"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "destructive" | "default"
    isConfirming?: boolean
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    variant = "destructive",
    isConfirming = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={isConfirming ? () => {} : onClose}
            title={title}
            className="!max-w-md"
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                            variant === "destructive"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-primary/10 text-primary"
                        )}
                    >
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isConfirming}
                        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
                            variant === "destructive"
                                ? "bg-destructive hover:bg-destructive/90"
                                : "gradient-red glow-red hover:scale-105"
                        )}
                    >
                        {isConfirming && <Spinner className="h-4 w-4" />}
                        {isConfirming ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
