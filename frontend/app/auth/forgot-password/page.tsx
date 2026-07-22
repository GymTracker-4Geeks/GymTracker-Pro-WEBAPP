"use client";

import Link from 'next/link';
import { ForgotPasswordData } from '@/lib/types';
import { forgotPassword } from '@/services/authService';
import { useState } from 'react';
import { Flame } from 'lucide-react';

export default function ForgotPassword() {
    const [form, setForm] = useState<ForgotPasswordData>({ email: '' })
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        try {
            await forgotPassword(form);
            setMessage('If the email exists in our system, you will receive a link to reset your password in a few minutes.');
            setForm({ email: '' });

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error has occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-background flex min-h-screen items-center justify-center bg-background px-4">

            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-card/90 backdrop-blur-xl p-8 shadow-2xl hover:border-primary/30">

                <div className="mb-6 flex items-center justify-center gap-3">
                    <Link href="/" className="flex items-center justify-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg gradient-red glow-red">
                            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
                        </div>

                        <div className="text-left">
                            <h1 className="font-display text-2xl font-bold text-foreground">
                                GymTracker
                            </h1>
                            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                                PRO
                            </span>
                        </div>
                    </Link>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                        {message}
                    </div>
                )}

                <div className="mb-5 text-center text-sm text-muted-foreground">
                    Enter your email and we will send you instructions to reset your password.
                </div>

                <div className="flex flex-col gap-1 mt-2">
                    <label className="text-gray-700 text-sm font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="email@gmail.com"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="gradient-red glow-red mt-8 w-full rounded-lg py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Sending..' : 'Send Instructions'}
                </button>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link href="/auth/login" className="font-semibold text-primary hover:opacity-80">
                        Login
                    </Link>
                </div>

            </form>

        </div>
    );
}