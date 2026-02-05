import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps, SharedData } from '@/types';
import { Shield, Zap, Users } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="grid min-h-svh w-full lg:grid-cols-2">
            {/* Left panel — modern branding */}
            <div className="relative hidden overflow-hidden lg:block">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
                {/* Mesh accent */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--primary) / 0.25) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, hsl(var(--primary) / 0.15) 0%, transparent 50%)',
                    }}
                />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.5) 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                />
                {/* Soft orbs for depth */}
                <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-zinc-500/10 blur-2xl" />

                <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-zinc-100 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
                    >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                            <AppLogoIcon className="size-5 fill-white" />
                        </div>
                        <span className="text-base font-semibold tracking-tight">
                            {name}
                        </span>
                    </Link>

                    <blockquote className="space-y-6">
                        <p className="max-w-sm text-xl font-medium leading-relaxed text-zinc-200 xl:text-2xl">
                            Secure, simple authentication. Built for teams that
                            ship.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm">
                                <Shield className="size-3.5" />
                                Privacy-first
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm">
                                <Zap className="size-3.5" />
                                Two-factor ready
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm">
                                <Users className="size-3.5" />
                                Role-based access
                            </span>
                        </div>
                    </blockquote>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="relative flex flex-col items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950 sm:px-8 lg:px-12">
                {/* Subtle dot texture (right half on desktop) */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.2] lg:left-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.06) 1px, transparent 0)`,
                        backgroundSize: '20px 20px',
                    }}
                    aria-hidden
                />
                <div className="relative z-10 w-full max-w-[420px] space-y-8">
                    <div className="flex flex-col items-center gap-4 lg:hidden">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-2.5 font-medium text-foreground shadow-sm"
                        >
                            <AppLogoIcon className="size-8 fill-current text-[var(--foreground)]" />
                            <span className="sr-only">{name}</span>
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none sm:p-10">
                        <div className="space-y-2 mb-8">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}