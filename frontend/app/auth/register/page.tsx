"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';
import { Flame, Eye, EyeOff } from 'lucide-react';
import { RegisterFormState } from '@/lib/types';

export default function Register() {
    const [form, setForm] = useState<RegisterFormState>({ full_name: '', email: '', password: '', confirm_password: '' });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [capsLock, setCapsLock] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();
    const passwordsMatch = form.confirm_password && form.password === form.confirm_password

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState('CapsLock'))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirm_password) {
            setError('Passwords do not match')
            return
        }

        try {
            await register(form);
            setSuccess(true);

            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error has occurred");
            }
        };
    }

    return (
        <div className="auth-background flex min-h-screen items-center justify-center bg-background px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-[430px] rounded-3xl border border-white/10 bg-card/80 backdrop-blur-xl px-8 py-10 shadow-[0_20px_80px_rgba(0,0,0,.55)] 
                transition-all
                hover:border-primary/30
                space-y-6
                "
            >

                <div className="mb-8">
                    <Link href="/" className="flex items-center justify-center gap-3">
                        <div className="flex items-center justify-center gap-3">
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
                        </div>
                    </Link>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Create a new account
                    </p>
                </div>


                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                        ¡Account created successfully! Redirecting...
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Full Name
                    </label>
                    <input
                        name="full_name"
                        type="text"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Email
                    </label>
                    <input
                        name="email"
                        autoComplete="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@gmail.com"
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
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
                            required
                            className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
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
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-destructive dark:text-red-400 animate-slide-down">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-destructive/10 dark:bg-red-500/20 text-destructive dark:text-red-400">
                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                <path d="m18 9-6-6-6 6M12 3v12M5 21h14" />
                            </svg>
                        </div>
                        <span>Caps Lock is on — check your password</span>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Confirm Password
                    </label>
                    <input
                        name="confirm_password"
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        value={form.confirm_password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="••••••••••"
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                        minLength={6}
                    />

                    {form.confirm_password && (
                        <p className={`text-xs mt-1 ${passwordsMatch ? 'font-medium text-green-500' : 'font-medium text-primary'}`}>
                            {passwordsMatch ? '✅ Passwords match!' : '❌ Passwords do not match!'}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={success}
                    className="gradient-red glow-red mt-2 w-full rounded-lg py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Register
                </button>

                <div className="text-center text-sm text-muted-foreground">
                    ¿You already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-semibold text-primary hover:opacity-80"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}