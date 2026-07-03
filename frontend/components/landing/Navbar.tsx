'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const navLinks : { label : string; href: string }[] = [
    { label: 'Features', href: '/features' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
]

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5" aria-label="GymTracker Pro home">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EF4444]">
                        <svg
                            aria-hidden="true"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6.5 6.5C6.5 5.67157 7.17157 5 8 5C8.82843 5 9.5 5.67157 9.5 6.5V17.5C9.5 18.3284 8.82843 19 8 19C7.17157 19 6.5 18.3284 6.5 17.5V6.5Z"
                                fill="white"
                            />
                            <path
                                d="M14.5 6.5C14.5 5.67157 15.1716 5 16 5C16.8284 5 17.5 5.67157 17.5 6.5V17.5C17.5 18.3284 16.8284 19 16 19C15.1716 19 14.5 18.3284 14.5 17.5V6.5Z"
                                fill="white"
                            />
                            <path
                                d="M3 10C3 9.17157 3.67157 8.5 4.5 8.5H6.5V15.5H4.5C3.67157 15.5 3 14.8284 3 14V10Z"
                                fill="white"
                            />
                            <path
                                d="M17.5 8.5H19.5C20.3284 8.5 21 9.17157 21 10V14C21 14.8284 20.3284 15.5 19.5 15.5H17.5V8.5Z"
                                fill="white"
                            />
                            <rect x="9.5" y="11" width="5" height="2" rx="1" fill="white" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-[#FAFAFA]">GymTracker Pro</span>
                </Link>

                <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/auth/login"
                        className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
                    >
                        Login
                    </Link>
                    <Link
                        href="/get-started"
                        className="rounded-md bg-[#EF4444] px-4 py-1.5 text-sm font-semibold text-[#FAFAFA] transition-opacity hover:opacity-90"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/auth/register"
                        className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
                    >
                        Register
                    </Link>
                </div>

                <button
                    className="flex items-center justify-center text-[#A1A1AA] md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {mobileOpen && (
                <nav
                    aria-label="Mobile navigation"
                    className="border-t border-[#27272A] bg-[#09090B] px-4 pb-4 md:hidden"
                >
                    <ul className="flex flex-col gap-1 pt-2">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="block rounded-md px-3 py-2 text-sm text-[#A1A1AA] transition-colors hover:bg-[#18181B] hover:text-[#FAFAFA]"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="mt-2 border-t border-[#27272A] pt-2">
                            <a
                                href="#login"
                                className="block rounded-md px-3 py-2 text-sm text-[#A1A1AA] transition-colors hover:bg-[#18181B] hover:text-[#FAFAFA]"
                                onClick={() => setMobileOpen(false)}
                            >
                                Login
                            </a>
                        </li>
                        <li>
                            <a
                                href="#get-started"
                                className="mt-1 block rounded-md bg-[#EF4444] px-3 py-2 text-center text-sm font-semibold text-[#FAFAFA] transition-opacity hover:opacity-90"
                                onClick={() => setMobileOpen(false)}
                            >
                                Get Started
                            </a>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    )
}
