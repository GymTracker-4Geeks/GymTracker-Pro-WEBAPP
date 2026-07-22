import { Dumbbell, TrendingUp, Users, Library, ClipboardList, CalendarDays, ShieldCheck, MonitorSmartphone } from 'lucide-react'

const features = [
    {
        icon: Dumbbell,
        title: 'Workout Tracking',
        description: 'Log every set, rep, and weight with detailed workout history.',
    },
    {
        icon: TrendingUp,
        title: 'Progress Analytics',
        description: 'Track body weight and training volume over time.',
    },
    {
        icon: Users,
        title: 'Trainer & Client Dashboards',
        description: 'Separate interfaces for coaches and their athletes.',
    },
    {
        icon: Library,
        title: 'Exercise Library',
        description: 'Browse 1,300+ exercises with GIFs and instructions.',
    },
    {
        icon: ClipboardList,
        title: 'Routine Builder',
        description: 'Create and assign workout routines visually.',
    },
    {
        icon: CalendarDays,
        title: 'Training Agenda',
        description: 'Schedule sessions with an intuitive weekly calendar.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Authentication',
        description: 'One of the most secure auth in programming.',
    },
    {
        icon: MonitorSmartphone,
        title: 'Modern Responsive Design',
        description: 'Works seamlessly across desktop and mobile devices.',
    },
]

export default function Features() {
    return (
        <section id="features" className="bg-[#09090B] py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
                        Everything you need in one fitness platform
                    </h2>
                    <p className="mt-4 text-base text-[#A1A1AA]">
                        Powerful tools for coaches and clients — all in one platform.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="rounded-xl border border-[#27272A] bg-[#18181B] p-6 transition-colors hover:border-[#EF4444]/40"
                        >
                            <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
                                <f.icon className="h-5 w-5" />
                            </div>
                            <h3 className="mb-2 text-sm font-semibold text-[#FAFAFA]">{f.title}</h3>
                            <p className="text-sm text-[#A1A1AA]">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
