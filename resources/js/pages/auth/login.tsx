import { Form, Head } from '@inertiajs/react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your credentials to access your account."
        >
            <Head title="Log in" />

            {status && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                disableWhileProcessing
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
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
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="name@company.com"
                                        className={cn(
                                            'h-11 rounded-xl border-zinc-200/80 pl-10 bg-zinc-50/80 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700/80 dark:bg-zinc-800/50',
                                            errors.email &&
                                                'border-destructive focus:ring-destructive/20',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="group relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={cn(
                                            'h-11 rounded-xl border-zinc-200/80 pl-10 bg-zinc-50/80 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700/80 dark:bg-zinc-800/50',
                                            errors.password &&
                                                'border-destructive focus:ring-destructive/20',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex cursor-pointer items-center gap-3 rounded-lg py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal text-muted-foreground"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={4}
                                data-test="login-button"
                                className="group h-12 w-full rounded-xl bg-primary text-primary-foreground shadow-lg transition-all hover:translate-y-[-1px] hover:shadow-primary/25 active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Spinner className="mr-2 h-4 w-4" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign in
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="relative pt-8">
                                <div className="absolute inset-x-0 top-0 flex items-center gap-3">
                                    <span className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">or</span>
                                    <span className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <p className="relative flex justify-center pt-6 text-sm text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="font-semibold text-primary underline-offset-4 hover:underline"
                                    >
                                        Create account
                                    </TextLink>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
