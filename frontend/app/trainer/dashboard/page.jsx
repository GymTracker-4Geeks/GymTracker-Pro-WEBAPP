import {
    Bell,
    CalendarDays,
    ChevronRight,
    CreditCard,
    Dumbbell,
    Flame,
    LayoutGrid,
    LogOut,
    MessageSquare,
    Plus,
    Search,
    Settings,
    Users,
    WalletCards,
} from "lucide-react";

const navGroups = [
    {
        title: "Trabajo diario",
        items: [
            { label: "Dashboard", icon: LayoutGrid, active: true },
            { label: "Clientes", icon: Users, badge: "24" },
            { label: "Rutinas", icon: WalletCards },
            { label: "Ejercicios", icon: Dumbbell },
        ],
    },
    {
        title: "Negocio",
        items: [
            { label: "Agenda", icon: CalendarDays },
            { label: "Mensajes", icon: MessageSquare, badge: "3" },
            { label: "Pagos", icon: CreditCard },
        ],
    },
    {
        title: "Cuenta",
        items: [{ label: "Configuracion", icon: Settings }],
    },
];

const metrics = [
    {
        label: "Clientes activos",
        value: "24",
        trend: "+3 este mes",
        icon: Users,
        tone: "positive",
    },
    {
        label: "Sesiones esta semana",
        value: "42",
        trend: "8 hoy",
        icon: CalendarDays,
        tone: "positive",
    },
    {
        label: "MRR",
        value: "3.480 EUR",
        trend: "+12,5%",
        icon: CreditCard,
        tone: "positive",
    },
    {
        label: "Mensajes sin leer",
        value: "7",
        trend: "-2 vs ayer",
        icon: MessageSquare,
        tone: "negative",
    },
];

const schedule = [
    { time: "09:00", name: "Lucia Martin", type: "Sesion 1-a-1", color: "bg-rose-500" },
    { time: "10:30", name: "Ivan Romero", type: "Revision plan", color: "bg-emerald-500" },
    { time: "12:00", name: "Sara Lopez", type: "Sesion 1-a-1", color: "bg-rose-500" },
    { time: "17:00", name: "Marc Puig", type: "Onboarding", color: "bg-amber-400" },
    { time: "18:30", name: "Noa Garcia", type: "Sesion 1-a-1", color: "bg-rose-500" },
];

const chartPoints = "0,162 110,146 220,126 330,106 440,88 550,72 660,56 770,34";
const chartArea = `${chartPoints} 770,230 0,230`;

function SidebarItem({ item }) {
    const Icon = item.icon;

    return (
        <a
            className={`flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition ${item.active
                    ? "bg-[#f52c3c] text-white shadow-[0_18px_45px_rgba(245,44,60,0.34)]"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
            href="#"
        >
            <span className="flex items-center gap-3">
                <Icon size={18} strokeWidth={2} />
                {item.label}
            </span>
            {item.badge ? (
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs text-zinc-200">
                    {item.badge}
                </span>
            ) : null}
        </a>
    );
}

export default function TrainerDashboardPage() {
    return (
        <main className="min-h-screen bg-[#07080a] text-white">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-white/[0.08] bg-[#090a0c] lg:flex lg:flex-col">
                <div className="flex h-20 items-center gap-3 px-5">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ef2336] shadow-[0_16px_34px_rgba(239,35,54,0.35)]">
                        <Flame size={21} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-base font-bold leading-5">GymTracker</p>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ef2336]">
                            Coach
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-7 px-4 py-3">
                    {navGroups.map((group) => (
                        <section key={group.title}>
                            <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                                {group.title}
                            </p>
                            <div className="space-y-1.5">
                                {group.items.map((item) => (
                                    <SidebarItem item={item} key={item.label} />
                                ))}
                            </div>
                        </section>
                    ))}
                </nav>

                <div className="border-t border-white/[0.08] p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-[#f6e4d2] to-[#7c1d1d] text-sm font-black text-white">
                            CV
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">Carlos Vega</p>
                            <p className="truncate text-xs text-zinc-500">Entrenador - Pro</p>
                        </div>
                        <button
                            aria-label="Cerrar sesion"
                            className="grid h-9 w-9 place-items-center rounded-xl text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                        >
                            <LogOut size={17} />
                        </button>
                    </div>
                </div>
            </aside>

            <section className="min-h-screen lg:pl-[270px]">
                <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-xl">
                    <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:px-10">
                        <label className="relative hidden w-full max-w-[485px] md:block">
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                                size={19}
                            />
                            <input
                                className="h-11 w-full rounded-2xl border border-white/[0.09] bg-[#111216] pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-[#ef2336]/70 focus:ring-4 focus:ring-[#ef2336]/10"
                                placeholder="Buscar cliente, rutina, ejercicio..."
                            />
                        </label>

                        <div className="ml-auto flex items-center gap-3">
                            <button className="hidden h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#121318] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#181a20] sm:inline-flex">
                                <Plus size={16} className="text-[#ef2336]" />
                                Nuevo cliente
                            </button>
                            <button
                                aria-label="Notificaciones"
                                className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.08] bg-[#121318] text-zinc-300 hover:bg-[#181a20]"
                            >
                                <Bell size={17} />
                                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef2336] px-1 text-[10px] font-black text-white">
                                    3
                                </span>
                            </button>
                            <button className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#121318] px-3 text-sm font-bold hover:bg-[#181a20]">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#f6e4d2] to-[#7c1d1d] text-[10px] font-black">
                                    CV
                                </span>
                                <span className="hidden sm:inline">Carlos</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 xl:px-10">
                    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                                Hola 
                            </h1>
                            <p className="mt-3 text-base text-zinc-400">
                                Esto es lo que pasa hoy con tus clientes.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button className="h-12 rounded-2xl border border-white/[0.09] bg-[#121318] px-5 text-sm font-bold text-white hover:bg-[#181a20]">
                                Ver clientes
                            </button>
                            <button className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#ef2336] px-5 text-sm font-black text-white shadow-[0_18px_42px_rgba(239,35,54,0.38)] hover:bg-[#ff3144]">
                                <Plus size={18} />
                                Nuevo cliente
                            </button>
                        </div>
                    </section>

                    <section className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                        {metrics.map((metric) => {
                            const Icon = metric.icon;
                            const isPositive = metric.tone === "positive";

                            return (
                                <article
                                    className="rounded-[22px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                                    key={metric.label}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ef2336]/10 text-[#ef2336]">
                                            <Icon size={22} />
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-black ${isPositive
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-rose-500/10 text-rose-400"
                                                }`}
                                        >
                                            {metric.trend}
                                        </span>
                                    </div>
                                    <p className="mt-7 text-4xl font-black tracking-tight">
                                        {metric.value}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">{metric.label}</p>
                                </article>
                            );
                        })}
                    </section>

                    <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(380px,0.92fr)]">
                        <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black">Ingresos recurrentes</h2>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Ultimos 7 meses (MRR)
                                    </p>
                                </div>
                                <a className="text-sm font-black text-[#ef3345] hover:text-[#ff5260]" href="#">
                                    Ver pagos
                                </a>
                            </div>

                            <div className="mt-5 h-[365px] w-full overflow-hidden">
                                <svg className="h-full w-full" viewBox="0 0 820 300" role="img" aria-label="Grafico de ingresos recurrentes">
                                    <defs>
                                        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#ef2336" stopOpacity="0.55" />
                                            <stop offset="55%" stopColor="#ef2336" stopOpacity="0.18" />
                                            <stop offset="100%" stopColor="#ef2336" stopOpacity="0" />
                                        </linearGradient>
                                        <filter id="lineGlow">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {[44, 101, 158, 215].map((y) => (
                                        <line
                                            key={y}
                                            x1="52"
                                            x2="792"
                                            y1={y}
                                            y2={y}
                                            stroke="rgba(255,255,255,0.055)"
                                            strokeWidth="1"
                                        />
                                    ))}
                                    {["3600 EUR", "2700 EUR", "1800 EUR", "900 EUR", "0 EUR"].map((label, index) => (
                                        <text
                                            fill="#8b8d97"
                                            fontSize="13"
                                            key={label}
                                            x="0"
                                            y={48 + index * 57}
                                        >
                                            {label}
                                        </text>
                                    ))}

                                    {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"].map((label, index) => (
                                        <text
                                            fill="#8b8d97"
                                            fontSize="13"
                                            key={label}
                                            textAnchor="middle"
                                            x={52 + index * 123}
                                            y="278"
                                        >
                                            {label}
                                        </text>
                                    ))}

                                    <g transform="translate(52 28)">
                                        <polygon points={chartArea} fill="url(#chartFill)" />
                                        <polyline
                                            points={chartPoints}
                                            fill="none"
                                            filter="url(#lineGlow)"
                                            stroke="#ef3345"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="4"
                                        />
                                    </g>
                                </svg>
                            </div>
                        </article>

                        <article className="rounded-[24px] border border-white/[0.08] bg-[#121318] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black">Agenda de hoy</h2>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        5 sesiones programadas
                                    </p>
                                </div>
                                <a className="text-sm font-black text-[#ef3345] hover:text-[#ff5260]" href="#">
                                    Ver agenda
                                </a>
                            </div>

                            <div className="mt-5 space-y-3">
                                {schedule.map((session) => (
                                    <a
                                        className="group flex min-h-[68px] items-center gap-4 rounded-[18px] border border-white/[0.07] bg-[#090a0c] px-4 transition hover:border-[#ef2336]/45 hover:bg-[#0d0e11]"
                                        href="#"
                                        key={`${session.time}-${session.name}`}
                                    >
                                        <div className="w-14 shrink-0">
                                            <div className="flex items-center gap-1.5 text-zinc-500">
                                                <CalendarDays size={12} />
                                            </div>
                                            <p className="mt-1 text-base font-black">{session.time}</p>
                                        </div>
                                        <span className={`h-10 w-1 rounded-full ${session.color}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-black">{session.name}</p>
                                            <p className="mt-1 truncate text-sm text-zinc-500">
                                                {session.type}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            className="text-zinc-600 transition group-hover:text-white"
                                            size={19}
                                        />
                                    </a>
                                ))}
                            </div>
                        </article>
                    </section>
                </div>
            </section>
        </main>
    );
}