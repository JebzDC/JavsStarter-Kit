import { Form, Head } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Join thousands of professionals today."
        >
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                                    >
                                        Full name
                                    </Label>
                                    <div className="group relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            className={cn(
                                                'h-11 rounded-xl border-zinc-200/80 pl-10 bg-zinc-50/80 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700/80 dark:bg-zinc-800/50',
                                                errors.name &&
                                                    'border-destructive focus:ring-destructive/20',
                                            )}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                                    >
                                        Email address
                                    </Label>
                                    <div className="group relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="name@company.com"
                                            className={cn(
                                                'h-11 rounded-xl border-zinc-200/80 pl-10 bg-zinc-50/80 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700/80 dark:bg-zinc-800/50',
                                                errors.email &&
                                                    'border-destructive focus:ring-destructive/20',
                                            )}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                                    >
                                        Password
                                    </Label>
                                    <div className="group relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            className={cn(
                                                'h-11 rounded-xl border-zinc-200/80 pl-10 bg-zinc-50/80 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700/80 dark:bg-zinc-800/50',
                                                errors.password &&
                                                    'border-destructive focus:ring-destructive/20',
                                            )}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                                    >
                                        Confirm password
                                    </Label>
                                    <div className="group relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            className={cn(
                                                'h-11 rounded-xl border-zinc-200/80 pl-10 bg-zinc-50/80 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700/80 dark:bg-zinc-800/50',
                                                errors.password_confirmation &&
                                                    'border-destructive focus:ring-destructive/20',
                                            )}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <InputError
                                        message={
                                            errors.password ||
                                            errors.password_confirmation
                                        }
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="group h-12 w-full rounded-xl bg-primary text-primary-foreground shadow-lg transition-all hover:translate-y-[-1px] hover:shadow-primary/25 active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Spinner className="mr-2 h-4 w-4" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Get started
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </div>

                        <div className="relative pt-8">
                            <div className="absolute inset-x-0 top-0 flex items-center gap-3">
                                <span className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">or</span>
                                <span className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                            </div>
                            <p className="relative flex justify-center pt-6 text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <TextLink
                                    href={login()}
                                    className="font-semibold text-primary underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </TextLink>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
