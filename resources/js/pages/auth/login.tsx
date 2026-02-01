import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
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
            description="Enter your credentials to access your account"
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        className={cn(
                                            'pl-10 transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
                                            errors.email &&
                                                'border-destructive focus-visible:ring-destructive/20',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="inline-block rounded-lg px-2 py-1 text-sm text-slate-600 transition-all duration-300 hover:text-slate-900 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] dark:text-slate-400 dark:hover:text-white"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={cn(
                                            'pl-10',
                                            errors.password &&
                                                'border-destructive focus-visible:ring-destructive/20',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-shadow duration-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal text-slate-600 dark:text-slate-400"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-11 w-full font-medium transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="border-t border-slate-200 pt-6 text-center dark:border-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Don't have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="inline-block rounded-lg px-2 py-1 font-medium text-slate-900 underline-offset-4 transition-all duration-300 hover:underline hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] dark:text-white"
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
