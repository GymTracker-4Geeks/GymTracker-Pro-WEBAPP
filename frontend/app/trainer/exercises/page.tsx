"use client";

import { Plus, Filter, PlayCircle } from "lucide-react";
import { PageHeader } from "../layout";

const groups = ["Todos", "Pecho", "Espalda", "Pierna", "Hombro", "Brazo", "Core"];

const exercises = [
  {
    name: "Press de banca",
    group: "Pecho",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=260&fit=crop",
  },
  {
    name: "Sentadilla trasera",
    group: "Pierna",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=260&fit=crop",
  },
  {
    name: "Dominada",
    group: "Espalda",
    img: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=260&fit=crop",
  },
  {
    name: "Press militar",
    group: "Hombro",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=260&fit=crop",
  },
  {
    name: "Peso muerto",
    group: "Espalda",
    img: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=400&h=260&fit=crop",
  },
  {
    name: "Curl bíceps",
    group: "Brazo",
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=260&fit=crop",
  },
  {
    name: "Hip thrust",
    group: "Pierna",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=260&fit=crop",
  },
  {
    name: "Plancha",
    group: "Core",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=260&fit=crop",
  },
];

export default function ExercisesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Library of Exercises"
        subtitle="See how many exercises we have, be free to use any of this in your routines"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> New Exercise
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card p-1">
          {groups.map((g, i) => (
            <button
              key={g}
              type="button"
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40"
        >
          <Filter className="h-4 w-4 text-muted-foreground" /> Filtros
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {exercises.map((e) => (
          <div
            key={e.name}
            className="card-hover overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative h-36">
              <img src={e.img} alt={e.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                <PlayCircle className="h-10 w-10 text-white" />
              </div>
              <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                {e.group}
              </span>
            </div>
            <div className="p-4">
              <div className="font-semibold">{e.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Compuesto · Barra</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
