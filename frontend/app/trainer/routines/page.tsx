"use client";

import { useState } from "react"
import { Plus, Users, Copy, MoreVertical, Calendar } from "lucide-react";
import { PageHeader } from "../layout";
import { RoutineForm } from "@/components/routines/RoutineForm";

const routines = [
  {
    name: "Push / Pull / Legs",
    weeks: 8,
    days: 6,
    assigned: 9,
    focus: "Hipertrofia",
    color: "from-rose-600 to-rose-500",
  },
  {
    name: "Upper / Lower",
    weeks: 6,
    days: 4,
    assigned: 5,
    focus: "Fuerza",
    color: "from-amber-600 to-amber-500",
  },
  {
    name: "Full Body 3D",
    weeks: 4,
    days: 3,
    assigned: 4,
    focus: "Iniciación",
    color: "from-emerald-600 to-emerald-500",
  },
  {
    name: "Powerbuilding",
    weeks: 12,
    days: 5,
    assigned: 3,
    focus: "Fuerza + hipertrofia",
    color: "from-violet-600 to-violet-500",
  },
  {
    name: "Recomposición HIIT",
    weeks: 8,
    days: 4,
    assigned: 2,
    focus: "Pérdida grasa",
    color: "from-cyan-600 to-cyan-500",
  },
  {
    name: "Strong Mom",
    weeks: 10,
    days: 3,
    assigned: 1,
    focus: "Posparto",
    color: "from-pink-600 to-pink-500",
  },
];

export default function RoutinesPage() {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="New routine"
          subtitle="Create a routine using the exercise library"
          actions={
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          }
        />
        <RoutineForm />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Routines"
        subtitle="Your library of programs to assign to clients"
        actions={
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> New Routine
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((r) => (
          <div
            key={r.name}
            className="card-hover overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className={`h-24 bg-gradient-to-br ${r.color} relative`}>
              <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                {r.focus}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold">{r.name}</h3>
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {r.weeks} sem · {r.days} días
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {r.assigned} asignada
                  {r.assigned === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-border bg-background py-1.5 text-xs font-semibold hover:border-primary/40"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-muted-foreground hover:text-primary"
                  title="Duplicar"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg gradient-red py-1.5 text-xs font-semibold text-white"
                >
                  Asignar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
