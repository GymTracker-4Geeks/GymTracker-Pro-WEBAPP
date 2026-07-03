"use client";

import Link from 'next/link';
import { useState } from 'react';
import { login } from '@/services/authService';
import { useAuth } from '../../../context/AuthContext';
import { Flame, Eye, EyeOff } from 'lucide-react';
import { LoginData } from '@/lib/types';

export default function Login() {
    const [form, setForm] = useState<LoginData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [capsLock, setCapsLock] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { loginUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState('CapsLock'))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const data = await login(form);
            loginUser(data.access_token, data.user.role);
            setSuccess(true);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error has occurred.");
            }
        };
    }

    return (
        <div className="auth-background flex min-h-screen items-center justify-center bg-background px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-card/90 backdrop-blur-xl p-8 shadow-2xl hover:border-primary/30"
            >

                <div className="mb-8 flex items-center justify-center gap-3">
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
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                        ¡Logged successfully! Redirecting...
                    </div>
                )}

                <div className="mb-5 flex flex-col gap-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                    >
                        Email
                    </label>

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@gmail.com"
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-foreground"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            placeholder="••••••••••"
                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {capsLock && passwordFocused && (
                    <div className="mb-2 flex items-center gap-1 text-xs font-medium text-destructive dark:text-red-400 animate-slide-down">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-destructive/10 dark:bg-red-500/20 text-destructive dark:text-red-400">
                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                <path d="m18 9-6-6-6 6M12 3v12M5 21h14" />
                            </svg>
                        </div>
                        <span>Caps Lock is on — check your password</span>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-4 mb-5 gradient-red glow-red w-full rounded-lg py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                    Login
                </button>

                <div className="text-center text-sm text-muted-foreground">
                    ¿Forgot your password?{" "}
                    <Link
                        href="/auth/forgot-password"
                        className="font-semibold text-primary hover:opacity-80"
                    >
                        Here
                    </Link>
                </div>
            </form>
        </div>
    );
}