import { Head, router, useForm } from '@inertiajs/react';
import { 
    Edit2, 
    Key,
    Link2,
    Plus, 
    Shield, 
    Trash2, 
    Search, 
    MoreVertical,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { StatCard } from '@/components/stat-card';
import { TableCard } from '@/components/table-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    
    { title: 'Roles', href: index().url },
];

export default function RolesIndex({ roles, permissions }: RolesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Form Hooks with explicit type safety
    const createForm = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: '',
        permissions: [],
    });

    const editForm = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: '',
        permissions: [],
    });

    const filteredRoles = useMemo(() => {
        return roles.filter(role => 
            role.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [roles, searchQuery]);

    const handleCreate = (e: React.FormEvent): void => {
        e.preventDefault();
        createForm.post(store().url, {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!editingRole) return;
        editForm.put(update(editingRole.id).url, {
            onSuccess: () => {
                setEditingRole(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (): void => {
        if (!deleteConfirm) return;
        router.delete(destroy(deleteConfirm.id).url, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const togglePermission = (
        form: ReturnType<typeof useForm<{ name: string; permissions: string[] }>>,
        permissionName: string
    ): void => {
        const current = form.data.permissions;
        if (current.includes(permissionName)) {
            form.setData('permissions', current.filter((p) => p !== permissionName));
        } else {
            form.setData('permissions', [...current, permissionName]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Management" />

            <div className="w-full space-y-8 px-6 py-6 md:px-4">
                

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Total Roles"
                        value={roles.length}
                        subtext="Defined system roles"
                        icon={Shield}
                        variant="cyan"
                    />
                    <StatCard
                        label="System Permissions"
                        value={permissions.length}
                        subtext="Granular access points"
                        icon={Key}
                        variant="green"
                    />
                    <StatCard
                        label="Permission Assignments"
                        value={roles.reduce((sum, r) => sum + r.permissions.length, 0)}
                        subtext="Role–permission links"
                        icon={Link2}
                        variant="pink"
                    />
                </div>

                {/* Roles table card */}
                <TableCard
                    title="Roles"
                    count={filteredRoles.length}
                    defaultOpen={true}
                    headerRight={
                        <>
                            <div className="relative w-full min-w-0 sm:w-48">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search roles..."
                                    className="h-9 w-full bg-muted/50 pl-9 text-sm"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="h-9 shrink-0 gap-1.5 font-medium">
                                        <Plus className="h-4 w-4" />
                                        New role
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <form onSubmit={handleCreate}>
                                        <DialogHeader>
                                            <DialogTitle>Create role</DialogTitle>
                                            <DialogDescription>
                                                Add a new role and assign permissions.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="create-name">Role name</Label>
                                                <Input
                                                    id="create-name"
                                                    className="h-9"
                                                    value={createForm.data.name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('name', e.target.value)}
                                                />
                                                <InputError message={createForm.errors.name} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Permissions</Label>
                                                <div className="grid max-h-[220px] gap-2 overflow-y-auto rounded-lg border border-border/80 bg-muted/30 p-3">
                                                    {permissions.map((perm) => (
                                                        <label
                                                            key={perm.id}
                                                            className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                                                        >
                                                            <Checkbox
                                                                id={`create-${perm.id}`}
                                                                checked={createForm.data.permissions.includes(perm.name)}
                                                                onCheckedChange={() => togglePermission(createForm, perm.name)}
                                                            />
                                                            <span className="font-medium text-foreground">{perm.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="gap-2">
                                            <Button type="submit" disabled={createForm.processing}>
                                                Create role
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </>
                    }
                >
                    {filteredRoles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] text-sm">
                                <thead>
                                    <tr className="border-b border-border/60 bg-muted/20 dark:bg-muted/30">
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-4">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-4">
                                            Permissions
                                        </th>
                                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {filteredRoles.map((role, idx) => (
                                        <tr
                                            key={role.id}
                                            className={`transition-colors hover:bg-muted/20 dark:hover:bg-muted/25 ${idx % 2 === 1 ? 'bg-muted/[0.03] dark:bg-muted/[0.05]' : ''}`}
                                        >
                                            <td className="px-4 py-3 sm:px-5 sm:py-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Shield className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-foreground">
                                                            {role.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 sm:px-5 sm:py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {role.permissions.length > 0 ? (
                                                        role.permissions.map((p) => (
                                                            <Badge
                                                                key={p.id}
                                                                variant="secondary"
                                                                className="rounded-md px-2 py-0 text-xs font-medium text-muted-foreground"
                                                            >
                                                                {p.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs italic text-muted-foreground/70">—</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right sm:px-5 sm:py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                editForm.setData({
                                                                    name: role.name,
                                                                    permissions: role.permissions.map((p) => p.name),
                                                                });
                                                                setEditingRole(role);
                                                            }}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => setDeleteConfirm(role)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                            <div className="rounded-full bg-muted/50 p-4 dark:bg-muted/80">
                                <Shield className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <p className="mt-4 font-medium text-muted-foreground">No roles match your search</p>
                            <p className="mt-1 text-sm text-muted-foreground/80">
                                Try a different search or create a new role.
                            </p>
                        </div>
                    )}
                </TableCard>
            </div>

            {/* Edit dialog */}
            <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit role</DialogTitle>
                            <DialogDescription>
                                Update the role name and its permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Role name</Label>
                                <Input
                                    id="edit-name"
                                    className="h-9"
                                    value={editForm.data.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('name', e.target.value)}
                                />
                                <InputError message={editForm.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label>Permissions</Label>
                                <div className="grid max-h-[220px] gap-2 overflow-y-auto rounded-lg border border-border/80 bg-muted/30 p-3">
                                    {permissions.map((perm) => (
                                        <label
                                            key={perm.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                                        >
                                            <Checkbox
                                                id={`edit-${perm.id}`}
                                                checked={editForm.data.permissions.includes(perm.name)}
                                                onCheckedChange={() => togglePermission(editForm, perm.name)}
                                            />
                                            <span className="font-medium text-foreground">{perm.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={editForm.processing}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete role</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteConfirm?.name}&quot;? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}