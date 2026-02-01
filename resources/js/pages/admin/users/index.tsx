import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Eye, EyeOff, Key, Plus, Trash2, UserIcon, Users } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

interface UsersIndexProps {
    users: (User & { roles: Role[]; permissions: Permission[] })[];
    roles: Role[];
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: index().url,
    },
];

export default function UsersIndex({ users, roles, permissions }: UsersIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<(User & { roles: Role[]; permissions: Permission[] }) | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
        permissions: [] as string[],
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
        permissions: [] as string[],
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store().url, {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                setShowPassword(false);
                setShowConfirmPassword(false);
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(update(editingUser.id).url, {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
                setShowPassword(false);
                setShowConfirmPassword(false);
            },
        });
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        router.delete(destroy(deleteConfirm.id).url, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

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

    const toggleRole = (form: typeof createForm | typeof editForm, roleName: string) => {
        const current = form.data.roles;
        if (current.includes(roleName)) {
            form.setData({
                ...form.data,
                roles: current.filter((r) => r !== roleName),
            });
        } else {
            form.setData({
                ...form.data,
                roles: [...current, roleName],
            });
        }
    };

    const togglePermission = (form: typeof createForm | typeof editForm, permissionName: string) => {
        const current = form.data.permissions;
        if (current.includes(permissionName)) {
            form.setData({
                ...form.data,
                permissions: current.filter((p) => p !== permissionName),
            });
        } else {
            form.setData({
                ...form.data,
                permissions: [...current, permissionName],
            });
        }
    };

    // Group permissions by prefix
    const groupedPermissions = permissions.reduce(
        (groups, permission) => {
            const parts = permission.name.split(/[.\s-]/);
            const group = parts.length > 1 ? parts[0] : 'general';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(permission);
            return groups;
        },
        {} as Record<string, Permission[]>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6 md:p-8">
                {/* Page header */}
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Users Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage users, their roles and direct permissions
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Create User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Create New User</DialogTitle>
                                    <DialogDescription>
                                        Add a new user and assign roles and permissions
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-name">Name</Label>
                                            <Input
                                                id="create-name"
                                                value={createForm.data.name}
                                                onChange={(e) => createForm.setData('name', e.target.value)}
                                                placeholder="John Doe"
                                            />
                                            <InputError message={createForm.errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-email">Email</Label>
                                            <Input
                                                id="create-email"
                                                type="email"
                                                value={createForm.data.email}
                                                onChange={(e) => createForm.setData('email', e.target.value)}
                                                placeholder="john@example.com"
                                            />
                                            <InputError message={createForm.errors.email} />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="create-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={createForm.data.password}
                                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                                    placeholder="••••••••"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            <InputError message={createForm.errors.password} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-password-confirm">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="create-password-confirm"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={createForm.data.password_confirmation}
                                                    onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                                    placeholder="••••••••"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    {roles.length > 0 && (
                                        <div className="grid gap-2">
                                            <Label>Roles</Label>
                                            <div className="flex flex-wrap gap-2 rounded-md border p-3">
                                                {roles.map((role) => (
                                                    <div key={role.id} className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`create-role-${role.id}`}
                                                            checked={createForm.data.roles.includes(role.name)}
                                                            onCheckedChange={() => toggleRole(createForm, role.name)}
                                                        />
                                                        <Label
                                                            htmlFor={`create-role-${role.id}`}
                                                            className="cursor-pointer text-sm font-normal"
                                                        >
                                                            {role.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Permissions */}
                                    {Object.keys(groupedPermissions).length > 0 && (
                                        <div className="grid gap-2">
                                            <Label>Direct Permissions</Label>
                                            <div className="max-h-48 space-y-3 overflow-y-auto rounded-md border p-3">
                                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                                    <div key={group}>
                                                        <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                                                            {group}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {perms.map((permission) => (
                                                                <div key={permission.id} className="flex items-center gap-1">
                                                                    <Checkbox
                                                                        id={`create-perm-${permission.id}`}
                                                                        checked={createForm.data.permissions.includes(permission.name)}
                                                                        onCheckedChange={() => togglePermission(createForm, permission.name)}
                                                                    />
                                                                    <Label
                                                                        htmlFor={`create-perm-${permission.id}`}
                                                                        className="cursor-pointer text-xs font-normal"
                                                                    >
                                                                        {permission.name}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    
                                    <Button type="submit" disabled={createForm.processing} className="shadow-sm">
                                        Create User
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-border/60 bg-card px-5 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold tabular-nums">{users.length}</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Total Users
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card px-5 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <UserIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold tabular-nums">{roles.length}</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Roles
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card px-5 py-4 shadow-sm md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Key className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold tabular-nums">{permissions.length}</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Permissions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <Card className="overflow-hidden border-border/60 shadow-sm">
                    <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="h-4 w-4 text-primary" />
                            All Users
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {users.length} user{users.length !== 1 ? 's' : ''} in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/30">
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                User
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Roles
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Direct Permissions
                                            </th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="group transition-colors hover:bg-muted/20"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/30">
                                                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-foreground">{user.name}</p>
                                                            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {user.roles.length === 0 ? (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                        ) : (
                                                            user.roles.map((role) => (
                                                                <Badge
                                                                    key={role.id}
                                                                    variant="default"
                                                                    className="text-xs font-medium"
                                                                >
                                                                    {role.name}
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {user.permissions.length === 0 ? (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                        ) : user.permissions.length <= 3 ? (
                                                            user.permissions.map((permission) => (
                                                                <Badge
                                                                    key={permission.id}
                                                                    variant="secondary"
                                                                    className="text-xs font-normal"
                                                                >
                                                                    {permission.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <>
                                                                {user.permissions.slice(0, 2).map((permission) => (
                                                                    <Badge
                                                                        key={permission.id}
                                                                        variant="secondary"
                                                                        className="text-xs font-normal"
                                                                    >
                                                                        {permission.name}
                                                                    </Badge>
                                                                ))}
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{user.permissions.length - 2}
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 opacity-70 transition-opacity hover:opacity-100"
                                                            onClick={() => openEditDialog(user)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive opacity-70 transition-opacity hover:opacity-100"
                                                            onClick={() => setDeleteConfirm(user)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-b-xl bg-muted/10 py-16">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                                    <Users className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <p className="text-base font-medium text-foreground">No users yet</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create your first user to get started
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create User
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/60 shadow-lg">
                    <form onSubmit={handleEdit}>
                        <DialogHeader className="space-y-1.5 pb-4">
                            <DialogTitle className="text-lg">Edit User</DialogTitle>
                            <DialogDescription className="text-sm">
                                Update user information, roles and permissions. Leave password blank to keep current.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="John Doe"
                                    />
                                    <InputError message={editForm.errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                    />
                                    <InputError message={editForm.errors.email} />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-password">New Password (optional)</Label>
                                    <div className="relative">
                                        <Input
                                            id="edit-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={editForm.data.password}
                                            onChange={(e) => editForm.setData('password', e.target.value)}
                                            placeholder="Leave blank to keep current"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <InputError message={editForm.errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-password-confirm">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="edit-password-confirm"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={editForm.data.password_confirmation}
                                            onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Roles */}
                            {roles.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Roles</Label>
                                    <div className="flex flex-wrap gap-2 rounded-md border p-3">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`edit-role-${role.id}`}
                                                    checked={editForm.data.roles.includes(role.name)}
                                                    onCheckedChange={() => toggleRole(editForm, role.name)}
                                                />
                                                <Label
                                                    htmlFor={`edit-role-${role.id}`}
                                                    className="cursor-pointer text-sm font-normal"
                                                >
                                                    {role.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Permissions */}
                            {Object.keys(groupedPermissions).length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Direct Permissions</Label>
                                    <div className="max-h-48 space-y-3 overflow-y-auto rounded-md border p-3">
                                        {Object.entries(groupedPermissions).map(([group, perms]) => (
                                            <div key={group}>
                                                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                                                    {group}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {perms.map((permission) => (
                                                        <div key={permission.id} className="flex items-center gap-1">
                                                            <Checkbox
                                                                id={`edit-perm-${permission.id}`}
                                                                checked={editForm.data.permissions.includes(permission.name)}
                                                                onCheckedChange={() => togglePermission(editForm, permission.name)}
                                                            />
                                                            <Label
                                                                htmlFor={`edit-perm-${permission.id}`}
                                                                className="cursor-pointer text-xs font-normal"
                                                            >
                                                                {permission.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={editForm.processing} className="shadow-sm">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <DialogContent className="border-border/60 shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the user "{deleteConfirm?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete} className="shadow-sm">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
