import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Plus, Shield, Trash2 } from 'lucide-react';
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
import { index, store, update, destroy } from '@/routes/admin/roles';
import type { BreadcrumbItem, Permission, Role } from '@/types';

interface RolesIndexProps {
    roles: Role[];
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: index().url,
    },
];

export default function RolesIndex({ roles, permissions }: RolesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);

    const createForm = useForm({
        name: '',
        permissions: [] as string[],
    });

    const editForm = useForm({
        name: '',
        permissions: [] as string[],
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
        if (!editingRole) return;
        editForm.put(update(editingRole.id).url, {
            onSuccess: () => {
                setEditingRole(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        router.delete(destroy(deleteConfirm.id).url, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const openEditDialog = (role: Role) => {
        editForm.setData({
            name: role.name,
            permissions: role.permissions.map((p) => p.name),
        });
        setEditingRole(role);
    };

    const togglePermission = (
        form: typeof createForm | typeof editForm,
        permissionName: string
    ) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Management" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6 md:p-8">
                {/* Page header */}
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Roles Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage user roles and assign permissions
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md border-border/60 shadow-lg">
                            <form onSubmit={handleCreate}>
                                <DialogHeader className="space-y-1.5 pb-4">
                                    <DialogTitle className="text-lg">Create New Role</DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Add a new role and assign permissions
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-name">Role Name</Label>
                                        <Input
                                            id="create-name"
                                            value={createForm.data.name}
                                            onChange={(e) =>
                                                createForm.setData('name', e.target.value)
                                            }
                                            placeholder="e.g., editor, moderator"
                                        />
                                        <InputError message={createForm.errors.name} />
                                    </div>

                                    {permissions.length > 0 && (
                                        <div className="grid gap-2">
                                            <Label>Permissions</Label>
                                            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border/50 bg-muted/20 p-3">
                                                {permissions.map((permission) => (
                                                    <div
                                                        key={permission.id}
                                                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
                                                    >
                                                        <Checkbox
                                                            id={`create-perm-${permission.id}`}
                                                            checked={createForm.data.permissions.includes(
                                                                permission.name
                                                            )}
                                                            onCheckedChange={() =>
                                                                togglePermission(
                                                                    createForm,
                                                                    permission.name
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`create-perm-${permission.id}`}
                                                            className="cursor-pointer text-sm font-normal"
                                                        >
                                                            {permission.name}
                                                        </Label>
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
                                        Create Role
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-border/60 bg-card px-5 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold tabular-nums">{roles.length}</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Total Roles
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="border-l-4 border-l-primary/60 bg-muted/20 px-5 py-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Shield className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <CardTitle className="truncate text-base font-semibold">{role.name}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {role.permissions.length} permission
                                                {role.permissions.length !== 1 ? 's' : ''} assigned
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-0.5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-70 hover:opacity-100"
                                            onClick={() => openEditDialog(role)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-70 hover:opacity-100"
                                            onClick={() => setDeleteConfirm(role)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {role.permissions.length === 0 ? (
                                        <span className="text-xs text-muted-foreground">No permissions assigned</span>
                                    ) : (
                                        role.permissions.map((permission) => (
                                            <Badge
                                                key={permission.id}
                                                variant="secondary"
                                                className="text-xs font-normal"
                                            >
                                                {permission.name}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {roles.length === 0 && (
                        <Card className="col-span-full overflow-hidden border-border/60 shadow-sm">
                            <CardContent className="flex flex-col items-center justify-center rounded-xl bg-muted/10 py-16">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                                    <Shield className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <p className="text-base font-medium text-foreground">No roles yet</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create your first role to get started
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Role
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
                <DialogContent className="max-w-md">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>Update role name and permissions</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Role Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    placeholder="e.g., editor, moderator"
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            {permissions.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Permissions</Label>
                                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                                        {permissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center gap-2"
                                            >
                                                <Checkbox
                                                    id={`edit-perm-${permission.id}`}
                                                    checked={editForm.data.permissions.includes(
                                                        permission.name
                                                    )}
                                                    onCheckedChange={() =>
                                                        togglePermission(editForm, permission.name)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`edit-perm-${permission.id}`}
                                                    className="cursor-pointer text-sm font-normal"
                                                >
                                                    {permission.name}
                                                </Label>
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
                            <Button type="submit" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Role</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the role "{deleteConfirm?.name}"? This
                            action cannot be undone.
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
