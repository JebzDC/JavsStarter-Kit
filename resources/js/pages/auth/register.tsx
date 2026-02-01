import { Form, Head } from '@inertiajs/react';
import { User, Mail, Lock } from 'lucide-react';
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
            title="Create your account"
            description="Get started with your free account in seconds"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Javes Cordova"
                                        className={cn(
                                            'pl-10 transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
                                            errors.name &&
                                                'border-destructive focus-visible:ring-destructive/20',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
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
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
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

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        className={cn(
                                            'pl-10 transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
                                            errors.password_confirmation &&
                                                'border-destructive focus-visible:ring-destructive/20',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-11 w-full font-medium"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="border-t border-slate-200 pt-6 text-center dark:border-slate-800">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{' '}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="inline-block rounded-lg px-2 py-1 font-medium text-slate-900 underline-offset-4 transition-all duration-300 hover:underline hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] dark:text-white"
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
