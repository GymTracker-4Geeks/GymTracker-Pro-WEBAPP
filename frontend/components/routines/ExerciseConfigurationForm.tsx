"use client"

import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import type { ExerciseConfig } from "@/lib/types"

interface ExerciseConfigurationFormProps {
    config: ExerciseConfig
    onChange: (config: Partial<ExerciseConfig>) => void
}

export function ExerciseConfigurationForm({
    config,
    onChange,
}: ExerciseConfigurationFormProps) {
    return (
        <div className="grid gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-2">
            <Input
                label="Sets"
                type="number"
                min={1}
                value={config.sets}
                onChange={(e) => onChange({ sets: Number(e.target.value) })}
            />
            <Input
                label="Reps"
                type="number"
                min={1}
                value={config.reps}
                onChange={(e) => onChange({ reps: Number(e.target.value) })}
            />
            <Input
                label="RIR"
                type="number"
                min={0}
                value={config.rir}
                onChange={(e) => onChange({ rir: Number(e.target.value) })}
            />
            <Input
                label="Rest (seconds)"
                type="number"
                min={0}
                value={config.restTime}
                onChange={(e) => onChange({ restTime: Number(e.target.value) })}
            />
            <Input
                label="Order"
                type="number"
                min={0}
                value={config.order}
                onChange={(e) => onChange({ order: Number(e.target.value) })}
            />
            <Textarea
                label="Notes"
                value={config.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
            />
        </div>
    )
}
