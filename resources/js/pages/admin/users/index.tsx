import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { StatCard } from '@/components/stat-card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { destroy, index, store, update } from '@/routes/admin/users';
import type { BreadcrumbItem, Permission, Role, User } from '@/types';
import { Head, router, useForm, Link } from '@inertiajs/react';
import {
    Edit2,
    Eye,
    EyeOff,
    Key,
    Mail,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserIcon,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type PaginatedUsers = {
    data: (User & { roles: Role[]; permissions: Permission[] })[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
};

interface UsersIndexProps {
    users: PaginatedUsers | (User & { roles: Role[]; permissions: Permission[] })[];
    roles: Role[];
    permissions: Permission[];
    search?: string;
}

function normalizeUsers(users: UsersIndexProps['users'] | undefined): PaginatedUsers {
    if (!users) {
        return { data: [], links: [], meta: { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 } };
    }
    if (Array.isArray(users)) {
        return {
            data: users,
            links: [],
            meta: { current_page: 1, last_page: 1, total: users.length, from: users.length ? 1 : 0, to: users.length },
        };
    }
    const data = users.data ?? [];
    const links = users.links ?? [];
    const meta = users.meta ?? { current_page: 1, last_page: 1, total: data.length, from: data.length ? 1 : 0, to: data.length };
    return { data, links, meta };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: index().url }];

export default function UsersIndex({ users: usersProp, roles, permissions, search: initialSearch = '' }: UsersIndexProps) {
    const users = normalizeUsers(usersProp);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    useEffect(() => setSearchQuery(initialSearch), [initialSearch]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<(User & { roles: Role[]; permissions: Permission[] }) | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const createForm = useForm({
        name: '', email: '', password: '', password_confirmation: '', roles: [] as string[], permissions: [] as string[],
    });

    const editForm = useForm({
        name: '', email: '', password: '', password_confirmation: '', roles: [] as string[], permissions: [] as string[],
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store().url, {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(update(editingUser.id).url, {
            onSuccess: () => setEditingUser(null),
        });
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        router.delete(destroy(deleteConfirm.id).url, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            const params = searchQuery.trim() ? { search: searchQuery.trim() } : {};
            router.get(index().url, params, { preserveState: true, preserveScroll: true });
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const openEditDialog = (user: User & { roles: Role[]; permissions: Permission[] }) => {
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            roles: user.roles.map((r) => r.name),
            permissions: user.permissions.map((p) => p.name),
        });
        setEditingUser(user);
    };

    const toggleItem = (form: any, field: 'roles' | 'permissions', name: string) => {
        const current = form.data[field];
        const next = current.includes(name) ? current.filter((i: string) => i !== name) : [...current, name];
        form.setData(field, next);
    };

    const groupedPermissions = permissions.reduce((groups, permission) => {
        const parts = permission.name.split(/[.\s-]/);
        const group = parts.length > 1 ? parts[0] : 'general';
        if (!groups[group]) groups[group] = [];
        groups[group].push(permission);
        return groups;
    }, {} as Record<string, Permission[]>);

    const UserFormFields = ({ form, isEdit = false }: { form: any; isEdit?: boolean }) => (
        <div className="grid gap-8 px-1 py-6">
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary/80 uppercase">
                    <UserIcon className="h-3.5 w-3.5" /> Identity & Security
                </div>
                <div className="grid grid-cols-1 gap-4 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="John Doe" />
                        <InputError message={form.errors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} placeholder="john@example.com" />
                        <InputError message={form.errors.email} />
                    </div>
                    <div className="space-y-2">
                        <Label>Password {isEdit && '(Optional)'}</Label>
                        <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} className="pr-10" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 opacity-50"><Eye className="h-4 w-4" /></button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <div className="relative">
                            <Input type={showConfirmPassword ? 'text' : 'password'} value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} className="pr-10" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 opacity-50"><Eye className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary/80 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> System Roles
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {roles.map((role) => (
                        <label key={role.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${form.data.roles.includes(role.name) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-background shadow-sm'}`}>
                            <span className="text-sm font-medium">{role.name}</span>
                            <Checkbox checked={form.data.roles.includes(role.name)} onCheckedChange={() => toggleItem(form, 'roles', role.name)} />
                        </label>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary/80 uppercase">
                    <Key className="h-3.5 w-3.5" /> Direct Permissions
                </div>
                <div className="rounded-xl border bg-muted/10 p-4 space-y-6">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                        <div key={group} className="space-y-3">
                            <h5 className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-widest pl-1">{group} Module</h5>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {perms.map((p) => (
                                    <div key={p.id} className="flex items-center space-x-2 rounded-lg border border-border/50 bg-background px-3 py-2.5 shadow-sm hover:border-primary/30 transition-colors">
                                        <Checkbox id={`perm-${p.id}-${isEdit ? 'edit' : 'create'}`} checked={form.data.permissions.includes(p.name)} onCheckedChange={() => toggleItem(form, 'permissions', p.name)} />
                                        <Label htmlFor={`perm-${p.id}-${isEdit ? 'edit' : 'create'}`} className="flex-1 cursor-pointer text-xs font-medium">{p.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />
            <div className="flex h-full min-w-0 flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-6 md:p-8">
                <div className="border-b border-border/50 pb-6">
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Users</h1>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">Manage administrative access and user profiles.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    <StatCard label="Total Users" value={users.meta.total} subtext="Total registered accounts" icon={Users} variant="cyan" />
                    <StatCard label="Active Roles" value={roles.length} subtext="Defined system roles" icon={ShieldCheck} variant="green" />
                    <StatCard label="System Permissions" value={permissions.length} subtext="Granular access points" icon={Key} variant="pink" />
                </div>

                <div className="flex flex-row items-center justify-end gap-3">
                    <div className="relative min-w-0 flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 h-11 w-full rounded-full"
                        />
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shrink-0 rounded-full shadow-lg transition-all hover:shadow-primary/20">
                                <Plus className="h-4 w-4 sm:mr-2" />
                                <span>Create User</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto p-0 border-none shadow-2xl sm:w-full">
                            <form onSubmit={handleCreate}>
                                <div className="border-b bg-primary/5 p-4 sm:p-6">
                                    <DialogTitle className="text-xl font-bold sm:text-2xl">Create Account</DialogTitle>
                                    <DialogDescription className="text-sm">Setup a new administrative or staff member.</DialogDescription>
                                </div>
                                <div className="px-4 sm:px-6"><UserFormFields form={createForm} /></div>
                                <DialogFooter className="gap-2 border-t bg-muted/30 p-4 sm:p-6">
                                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit" disabled={createForm.processing}>Create Account</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="overflow-hidden rounded-xl border border-border/60 bg-card/50 shadow-lg ring-1 ring-border/40 sm:rounded-2xl dark:border-border/40 dark:bg-card/30 dark:ring-border/20">
                    <CardHeader className="border-b border-border/50 bg-muted/5 px-4 py-4 dark:bg-muted/10 sm:px-6 sm:py-5">
                        <CardTitle className="text-sm font-bold tracking-tight sm:text-base">Member Directory</CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1">View and manage all registered users</p>
                    </CardHeader>
                    <div className="relative w-full overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {users.data.length > 0 && (
                            <>
                                {/* Mobile: card list */}
                                <div className="flex flex-col md:hidden">
                                    {users.data.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex flex-col gap-3 border-b border-border/40 p-4 last:border-b-0 hover:bg-muted/10 dark:hover:bg-muted/15"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/10 dark:from-primary/30 dark:to-primary/10 dark:ring-primary/20">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-semibold text-foreground">{user.name}</p>
                                                        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                                                            <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 gap-1.5">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => openEditDialog(user)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-destructive shadow-sm hover:bg-destructive/10 hover:border-destructive/30" onClick={() => setDeleteConfirm(user)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                {user.roles.length ? (
                                                    user.roles.map((r) => (
                                                        <Badge key={r.id} variant="secondary" className="rounded-md border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary">
                                                            {r.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs italic text-muted-foreground/70">No roles</span>
                                                )}
                                                {user.permissions.length > 0 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        · {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Desktop: table */}
                                <table className="hidden w-full min-w-[640px] text-sm md:table">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/20 dark:bg-muted/30">
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 sm:px-6 sm:py-4">User</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 sm:px-6 sm:py-4">Roles</th>
                                    <th className="hidden px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 lg:table-cell">Permissions</th>
                                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 sm:px-6 sm:py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {users.data.map((user, idx) => (
                                    <tr key={user.id} className={`group transition-colors duration-150 hover:bg-muted/20 dark:hover:bg-muted/25 ${idx % 2 === 1 ? 'bg-muted/[0.03] dark:bg-muted/[0.05]' : ''}`}>
                                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/10 dark:from-primary/30 dark:to-primary/10 dark:ring-primary/20 sm:h-11 sm:w-11">
                                                    <UserIcon className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-foreground">{user.name}</p>
                                                    <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.roles.length ? user.roles.map((r) => (
                                                    <Badge key={r.id} variant="secondary" className="rounded-md border-primary/20 bg-primary/10 px-2.5 py-0.5 font-medium text-primary dark:bg-primary/20 dark:text-primary">
                                                        {r.name}
                                                    </Badge>
                                                )) : (
                                                    <span className="text-xs italic text-muted-foreground/70">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.permissions.slice(0, 2).map((p) => (
                                                    <Badge key={p.id} variant="outline" className="rounded-md border-border/60 bg-background/80 px-2.5 py-0.5 text-xs font-medium dark:border-border/50 dark:bg-muted/30">
                                                        {p.name}
                                                    </Badge>
                                                ))}
                                                {user.permissions.length > 2 && (
                                                    <Badge variant="outline" className="rounded-md border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground dark:border-border/50 dark:bg-muted/40">
                                                        +{user.permissions.length - 2}
                                                    </Badge>
                                                )}
                                                {user.permissions.length === 0 && (
                                                    <span className="text-xs italic text-muted-foreground/70">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                                            <div className="flex justify-end gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => openEditDialog(user)}><Edit2 className="h-4 w-4" /></Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-destructive shadow-sm hover:bg-destructive/10 hover:border-destructive/30" onClick={() => setDeleteConfirm(user)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                            </>
                        )}
                        {users.data.length === 0 && (
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
                                <div className="rounded-full bg-muted/50 p-4 dark:bg-muted/80">
                                    <UserIcon className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                                <p className="mt-4 font-medium text-muted-foreground">No users yet</p>
                                <p className="mt-1 text-sm text-muted-foreground/80">Create your first user to get started.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-border/50 bg-muted/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:bg-muted/5">
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{users.meta.from}</span> to{' '}
                            <span className="font-semibold text-foreground">{users.meta.to}</span> of{' '}
                            <span className="font-semibold text-foreground">{users.meta.total}</span> users
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
                            {users.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium transition-all ${!link.url ? 'pointer-events-none cursor-default opacity-40' : 'hover:bg-muted hover:text-foreground'} ${link.active ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border/60 bg-background dark:border-border/50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-none p-0 shadow-2xl">
                    <form onSubmit={handleEdit}>
                        <div className="border-b bg-primary/5 p-6">
                            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                            <DialogDescription>Update credentials or manage access roles.</DialogDescription>
                        </div>
                        <div className="px-6"><UserFormFields form={editForm} isEdit /></div>
                        <DialogFooter className="gap-2 border-t bg-muted/30 p-6">
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={editForm.processing}>Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-none shadow-2xl sm:w-full">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-destructive sm:text-xl">Confirm Deletion</DialogTitle>
                        <DialogDescription className="pt-2 text-sm sm:text-base">
                            This action will permanently delete <span className="font-bold text-foreground">{deleteConfirm?.name}</span> and revoke all access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                        <Button variant="destructive" onClick={handleDelete} className="font-bold">Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}