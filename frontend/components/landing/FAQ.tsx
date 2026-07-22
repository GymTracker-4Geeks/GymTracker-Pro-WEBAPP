'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const items = [
    {
        q: 'What is GymTracker Pro?',
        a: 'A full-stack fitness management platform connecting trainers and clients with workout tracking, routine building, and progress analytics.',
    },
    {
        q: 'Who is GymTracker Pro for?',
        a: 'Professional trainers managing multiple clients and athletes who want to track their own training progress, athletes soon will have options to create routines without trainer.',
    },
    {
        q: 'Can trainers manage multiple clients?',
        a: 'Yes. Trainers can assign routines, schedule sessions, and monitor each client\'s progress from a dedicated dashboard.',
    },
    {
        q: 'Can clients track their workouts?',
        a: 'Absolutely. Clients can log exercises with sets, reps, and weight, and view their complete training history.',
    },
    {
        q: 'How many exercises are available?',
        a: 'The exercise library includes over 1,300 exercises with GIF demonstrations, instructions, and filters by muscle group and equipment.',
    },
    {
        q: 'Can I monitor my body weight?',
        a: 'Yes. The Body Weight module lets you log and track your weight over time with a full history view.',
    },
    {
        q: 'Is my data secure?',
        a: 'Authentication is handled perfect with protected API routes and role-based access control.',
    },
    {
        q: 'Is the application mobile friendly?',
        a: 'Yes. The interface is fully responsive and designed to work on desktop, tablet, and mobile devices.',
    },
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section id="faq" className="bg-[#09090B] py-24">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
                        Frequently asked questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {items.map((item, i) => {
                        const isOpen = openIndex === i
                        return (
                            <div
                                key={i}
                                className="overflow-hidden rounded-xl border border-[#27272A] bg-[#18181B]"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between p-5 text-left"
                                >
                                    <span className="pr-4 text-sm font-semibold text-[#FAFAFA]">
                                        {item.q}
                                    </span>
                                    <ChevronDown
                                        className="h-5 w-5 flex-shrink-0 text-[#A1A1AA] transition-transform duration-200"
                                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                                    />
                                </button>
                                <div
                                    className="overflow-hidden transition-all duration-200"
                                    style={{ maxHeight: isOpen ? '200px' : '0' }}
                                >
                                    <p className="px-5 pb-5 text-sm text-[#A1A1AA]">{item.a}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
