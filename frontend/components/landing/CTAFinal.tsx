import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CTAFinal() {
    return (
        <section className="bg-[#09090B] py-24">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
                    Ready to start your fitness journey?
                </h2>
                <p className="mt-4 text-base text-[#A1A1AA]">
                    Take control of your workouts, track your progress and achieve your fitness goals with GymTracker Pro.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 rounded-md bg-[#EF4444] px-5 py-2.5 text-sm font-semibold text-[#FAFAFA] transition-opacity hover:opacity-90"
                    >
                        Get Started
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 rounded-md border border-[#27272A] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#FAFAFA] transition-colors hover:bg-[#18181B]"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    )
}
