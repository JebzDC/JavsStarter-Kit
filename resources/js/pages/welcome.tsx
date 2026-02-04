import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Github,
    Layers,
    Lock,
    Shield,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

const features = [
    {
        icon: Zap,
        title: 'Laravel 12',
        description:
            'Built on the latest Laravel framework with modern PHP 8.2+ features.',
    },
    {
        icon: Layers,
        title: 'Inertia + React',
        description:
            'Single-page app experience with React and TypeScript—no API needed.',
    },
    {
        icon: Shield,
        title: 'Roles & Permissions',
        description:
            'Pre-configured authorization system ready for role-based access control.',
    },
    {
        icon: Lock,
        title: 'Type-Safe & Secure',
        description:
            'Fortify auth, 2FA support, and security best practices out of the box.',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Subtle grid background */}
                <div
                    className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]"
                    aria-hidden
                />

                {/* Header */}
                <header className="relative z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold text-slate-900 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:text-white rounded-lg p-1 -m-1"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                                <Zap className="h-4 w-4" />
                            </span>
                            JavsStarter-Kit
                        </Link>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button className="transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]" asChild>
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" className="transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]" asChild>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button className="transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]" asChild>
                                            <Link href={register()}>
                                                Get started
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <main className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Free & Open Source · MIT License
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
                            Laravel 12 + Inertia + React
                        </h1>
                        <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                            A production-ready starter kit with roles &
                            permissions. Build secure, type-safe web apps
                            without the setup.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {!auth.user && (
                                <>
                                    <Button
                                        size="lg"
                                        className="gap-2 transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                                        asChild
                                    >
                                        <Link href={register()}>
                                            Get started
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="gap-2 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        asChild
                                    >
                                        <Link href={login()}>
                                            Sign in
                                        </Link>
                                    </Button>
                                </>
                            )}
                            {auth.user && (
                                <Button size="lg" className="gap-2 transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]" asChild>
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                            <Button
                                size="lg"
                                variant="ghost"
                                className="gap-2 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                asChild
                            >
                                <a
                                    href="https://github.com/JebzDC"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4" />
                                    View on GitHub
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Feature grid */}
                    <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tech stack pills */}
                    <div className="mt-20 flex flex-wrap items-center justify-center gap-3">
                        {[
                            'Laravel 12',
                            'Inertia.js',
                            'React 19',
                            'TypeScript',
                            'Tailwind CSS',
                            'Fortify',
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-slate-200/60 bg-white/50 py-8 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Maintained by Javes Cordova · Licensed under MIT
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-600 transition-all duration-300 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:text-slate-400 dark:hover:text-white"
                            >
                                <BookOpen className="h-4 w-4" />
                                Laravel Docs
                            </a>
                            <a
                                href="https://inertiajs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-600 transition-all duration-300 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:text-slate-400 dark:hover:text-white"
                            >
                                <BookOpen className="h-4 w-4" />
                                Inertia Docs
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
