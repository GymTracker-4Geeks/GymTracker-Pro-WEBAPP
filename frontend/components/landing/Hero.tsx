import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link';

const avatars: { initials: string; bg: string }[] = [
    { initials: 'DE', bg: '#374151' },
]

export default function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#09090B] px-4 pt-14 sm:px-6 lg:px-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 50% at 55% 45%, rgba(239,68,68,0.12) 0%, transparent 70%)',
                }}
            />

            <div className="relative mx-auto w-full max-w-7xl">
                <div className="max-w-2xl">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B]/80 px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#EF4444]" aria-hidden="true" />
                        <span className="text-xs font-medium text-[#FAFAFA]">GymTracker Pro v2.0 is live</span>
                    </div>

                    <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#FAFAFA] text-balance sm:text-5xl lg:text-6xl">
                        The Operating System for{' '}
                        <span className="block">Elite Fitness Professionals</span>
                    </h1>

                    <p className="mb-10 max-w-lg text-base leading-relaxed text-[#A1A1AA]">
                        Manage clients, track progress, and scale your coaching business with the most powerful
                        platform ever built for the fitness industry.
                    </p>

                    <div className="mb-10 flex flex-wrap items-center gap-3">
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 rounded-md bg-[#EF4444] px-5 py-2.5 text-sm font-semibold text-[#FAFAFA] transition-opacity hover:opacity-90"
                        >
                            Get Started Free
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mb-6 h-px w-full max-w-sm bg-[#27272A]" aria-hidden="true" />

                    <div className="flex items-center gap-1" aria-label="Trusted by fitness professionals">
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.initials}
                                aria-hidden="true"
                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#09090B] text-xs font-semibold text-[#FAFAFA]"
                                style={{ backgroundColor: avatar.bg }}
                            >
                                {avatar.initials}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
