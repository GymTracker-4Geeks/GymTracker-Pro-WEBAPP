"use client";

import { PageHeader } from "../layout";

export default function Settings() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Settings" subtitle="Your profile settings and preferences" />

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Perfil del entrenador</h3>
          <p className="text-xs text-muted-foreground">
            Esta información la verán tus clientes.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nombre
              </span>
              <input
                defaultValue="Carlos Vega"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <input
                defaultValue="carlos@gymforge.app"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Biografía
              </span>
              <textarea
                rows={3}
                defaultValue="Entrenador personal especializado en hipertrofia y fuerza. CSCS certificado."
                className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary/60"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Marca</h3>
          <p className="text-xs text-muted-foreground">
            Personaliza el portal que ven tus clientes.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nombre del negocio
              </span>
              <input
                defaultValue="GymForge"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Color principal
              </span>
              <div className="flex items-center gap-2">
                <span className="h-10 w-10 rounded-lg bg-primary" />
                <input
                  defaultValue="#E53935"
                  className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/60"
                />
              </div>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Notificaciones</h3>
          <div className="mt-4 space-y-3">
            {[
              "Avísame cuando un cliente registre una sesión",
              "Resumen semanal por email cada lunes",
              "Alerta cuando un cobro falle",
            ].map((t) => (
              <label key={t} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <span className="text-sm">{t}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-5 py-2.5 text-sm font-semibold text-white"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
