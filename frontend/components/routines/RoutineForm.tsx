"use client"

import { useState } from "react"
import { Plus, Save } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { ExerciseLibraryModal } from "@/components/routines/ExerciseLibraryModal"
import { cn } from "@/lib/utils"

const WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

export function RoutineForm() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [selectedExercises, setSelectedExercises] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        )
    }

    const canSave = name.trim().length > 0

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground font-display">
                    Routine details
                </h2>
                <div className="space-y-4">
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Push Day A"
                    />
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of this routine..."
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground font-display">
                    Training days
                </h2>
                <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => {
                        const isSelected = selectedDays.includes(day)
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                className={cn(
                                    "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/15 text-primary"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                )}
                            >
                                {day.slice(0, 3)}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground font-display">
                        Exercises ({selectedExercises.length})
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        Add exercise
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Plus className="mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No exercises added yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                        Use the exercise library to add exercises to this routine
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={() => console.log({ name, description, selectedDays })}
                    disabled={!canSave}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white",
                        canSave
                            ? "gradient-red glow-red"
                            : "cursor-not-allowed bg-secondary text-muted-foreground"
                    )}
                >
                    <Save className="h-4 w-4" />
                    Save routine
                </Button>
            </div>

            <ExerciseLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(exercise) => {
                    console.log("Selected exercise:", exercise)
                    setIsModalOpen(false)
                }}
            />
        </div>
    )
}
