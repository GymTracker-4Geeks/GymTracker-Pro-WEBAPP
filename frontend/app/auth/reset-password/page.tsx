"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Flame, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/services/authService';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword({ token, new_password: password, confirm_new_password: confirmPassword });
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 2500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error has occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-background flex min-h-screen items-center justify-center bg-background px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-card/90 backdrop-blur-xl p-8 shadow-2xl hover:border-primary/30"
            >
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
                    <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                        Password updated successfully! Redirecting to login...
                    </div>
                )}

                <div className="mb-5 text-center text-sm text-muted-foreground">
                    Enter your new password below.
                </div>

                <div className="mb-4 flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={isSubmitting || success}
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            disabled={isSubmitting || success}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={isSubmitting || success}
                        minLength={8}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || success}
                    className="gradient-red glow-red w-full rounded-lg py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
