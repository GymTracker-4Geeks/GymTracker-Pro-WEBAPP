"use client"

import { useState, useEffect, useCallback } from "react"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import { createWeight, updateWeight } from "@/services/bodyweightService"
import type { BodyWeightRecord } from "@/lib/types"

interface BodyWeightFormModalProps {
    isOpen: boolean
    onClose: () => void
    mode: "create" | "edit"
    record?: BodyWeightRecord
    onSaved: (record: BodyWeightRecord) => void
}

export function BodyWeightFormModal({
    isOpen,
    onClose,
    mode,
    record,
    onSaved,
}: BodyWeightFormModalProps) {
    const [weight, setWeight] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) return
        if (mode === "create") {
            setWeight("")
        } else if (record) {
            setWeight(String(record.weight))
        }
        setError(null)
    }, [isOpen, mode, record])

    const handleSubmit = useCallback(async () => {
        if (!weight || Number(weight) <= 0) {
            setError("Weight must be positive")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            if (mode === "create") {
                const data = await createWeight({ weight: Number(weight) })
                onSaved(data.body_weight)
            } else if (record) {
                const data = await updateWeight(record.id, { weight: Number(weight) })
                onSaved(data.body_weight)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save")
        } finally {
            setIsSubmitting(false)
        }
    }, [weight, mode, record, onSaved])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === "create" ? "Log Weight" : "Edit Weight"}
            className="!max-w-sm"
        >
            <div className="space-y-4">
                <Input
                    label="Weight (kg)"
                    type="number"
                    min={0}
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 75.5"
                />

                {error && (
                    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="gradient-red glow-red inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner className="h-4 w-4" />
                                Saving...
                            </>
                        ) : mode === "create" ? (
                            "Save"
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
