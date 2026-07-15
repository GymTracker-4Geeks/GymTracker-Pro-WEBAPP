"use client";

import { Dumbbell, Flame, Clock, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { PageHeader } from "../layout";

const stats = [
    { icon: Dumbbell, label: "Trainings", value: "24", unit: "this month", trend: "+12%", up: true },
    { icon: Flame, label: "Calories", value: "8,450", unit: "this month", trend: "+8%", up: true },
    { icon: Clock, label: "Time", value: "18 h 30 min", unit: "this month", trend: "+5%", up: true },
    { icon: BarChart3, label: "Volume", value: "125,600 kg", unit: "this month", trend: "-2%", up: false },
];

const series = [
    { day: "Lun", v: 8000 },
    { day: "Mar", v: 13800 },
    { day: "Mié", v: 16600 },
    { day: "Jue", v: 8600 },
    { day: "Vie", v: 13800 },
    { day: "Sáb", v: 14400 },
    { day: "Dom", v: 20100 },
];

const muscles = [
    { name: "Chest", count: 16, pct: 95 },
    { name: "Back", count: 14, pct: 80 },
    { name: "Legs", count: 16, pct: 95 },
    { name: "Shoulders", count: 10, pct: 60 },
    { name: "Bíceps", count: 12, pct: 72 },
    { name: "Tríceps", count: 11, pct: 65 },
];

export default function ProgressPage() {
    const [tab, setTab] = useState<string>("Resume");
    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Progress" subtitle="Your progress, metrics, and trends at a glance." />

            <div className="mb-6 flex gap-1 border-b border-border">
                {["Resume", "Trainings", "Measurements"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t}
                        {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <div key={s.label} className="card-hover rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                <s.icon className="h-5 w-5" />
                            </div>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.up ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"}`}>
                                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {s.trend}
                            </span>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">{s.label}</div>
                        <div className="mt-1 text-2xl font-bold">{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.unit}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Weekly Progress</h3>
                            <p className="text-xs text-muted-foreground">Volume Evolution (kg)</p>
                        </div>
                        <select className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary outline-none">
                            <option>Volume</option>
                            <option>Calories</option>
                            <option>Time</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={series} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.55} />
                                        <stop offset="100%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="oklch(0.24 0.008 270)" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.01 270)", fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.01 270)", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 270)", border: "1px solid oklch(0.26 0.008 270)", borderRadius: 8 }} />
                                <Area type="monotone" dataKey="v" stroke="oklch(0.62 0.22 25)" strokeWidth={2.5} fill="url(#g)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Muscles Groups</h3>
                        <button className="text-sm font-medium text-primary hover:underline">View more</button>
                    </div>
                    <div className="space-y-4">
                        {muscles.map((m) => (
                            <div key={m.name}>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{m.name}</span>
                                    <span className="text-xs text-muted-foreground">{m.count} entr.</span>
                                </div>
                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-accent">
                                    <div className="h-full rounded-full gradient-red" style={{ width: `${m.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
