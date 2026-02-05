import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Edit2,
    Key,
    Link2,
    MoreVertical,
    Plus,
    Search,
    Shield,
    Trash2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { StatCard } from '@/components/stat-card';
import { TableCard } from '@/components/table-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MultiSelectSearch } from '@/components/ui/multi-select-search';
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
import { SuccessNotification, type SuccessVariant } from '@/components/success-notification';
import { index, store, update, destroy } from '@/routes/admin/roles';
import type { BreadcrumbItem, Permission, Role } from '@/types';

type PaginatedRoles = {
    data: Role[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
};

interface RolesIndexProps {
    roles: PaginatedRoles | Role[];
    permissions: Permission[];
    search?: string;
}

function normalizeRoles(rolesProp: RolesIndexProps['roles'] | undefined): PaginatedRoles {
    if (!rolesProp) {
        return { data: [], links: [], meta: { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 } };
    }
    if (Array.isArray(rolesProp)) {
        return {
            data: rolesProp,
            links: [],
            meta: {
                current_page: 1,
                last_page: 1,
                total: rolesProp.length,
                from: rolesProp.length ? 1 : 0,
                to: rolesProp.length,
            },
        };
    }
    const data = rolesProp.data ?? [];
    const links = rolesProp.links ?? [];
    const meta = rolesProp.meta ?? {
        current_page: 1,
        last_page: 1,
        total: data.length,
        from: data.length ? 1 : 0,
        to: data.length,
    };
    return { data, links, meta };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: index().url }];

export default function RolesIndex({ roles: rolesProp, permissions, search: initialSearch = '' }: RolesIndexProps) {
    const roles = normalizeRoles(rolesProp);
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);
    const [successNotification, setSuccessNotification] = useState<{ variant: SuccessVariant } | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
    const isFirstMount = useRef(true);

    useEffect(() => setSearchQuery(initialSearch), [initialSearch]);
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

    const handleCreate = (e: React.FormEvent): void => {
        e.preventDefault();
        createForm.post(store().url, {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                setSuccessNotification({ variant: 'created' });
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
                setSuccessNotification({ variant: 'updated' });
            },
        });
    };

    const handleDelete = (): void => {
        if (!deleteConfirm) return;
        router.delete(destroy(deleteConfirm.id).url, {
            onSuccess: () => {
                setDeleteConfirm(null);
                setSuccessNotification({ variant: 'deleted' });
            },
        });
    };

    const permissionOptions = permissions.map((p) => ({ value: p.name, label: p.name }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Management" />

            <div className="w-full space-y-8 px-6 py-6 md:px-4">
                

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Total Roles"
                        value={roles.meta.total}
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
                        value={roles.data.reduce((sum, r) => sum + r.permissions.length, 0)}
                        subtext="On this page"
                        icon={Link2}
                        variant="pink"
                    />
                </div>

                {/* Roles table card */}
                <TableCard
                    title="Roles"
                    count={roles.meta.total}
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
                                                <MultiSelectSearch
                                                    options={permissionOptions}
                                                    value={createForm.data.permissions}
                                                    onChange={(v) => createForm.setData('permissions', v)}
                                                    placeholder="Select permissions..."
                                                    searchPlaceholder="Search permissions..."
                                                    emptyMessage="No permissions found."
                                                    maxBadges={4}
                                                />
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
                    {roles.data.length > 0 ? (
                        <>
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
                                        {roles.data.map((role, idx) => (
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
                            <div className="flex flex-col gap-4 border-t border-border/50 bg-muted/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:bg-muted/5">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{roles.meta.from}</span> to{' '}
                                    <span className="font-semibold text-foreground">{roles.meta.to}</span> of{' '}
                                    <span className="font-semibold text-foreground">{roles.meta.total}</span> roles
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
                                    {roles.links.map((link, i) => (
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                            <div className="rounded-full bg-muted/50 p-4 dark:bg-muted/80">
                                <Shield className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <p className="mt-4 font-medium text-muted-foreground">
                                {roles.meta.total === 0 ? 'No roles yet' : 'No roles match your search'}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground/80">
                                {roles.meta.total === 0 ? 'Create your first role to get started.' : 'Try a different search or create a new role.'}
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
                                <MultiSelectSearch
                                    options={permissionOptions}
                                    value={editForm.data.permissions}
                                    onChange={(v) => editForm.setData('permissions', v)}
                                    placeholder="Select permissions..."
                                    searchPlaceholder="Search permissions..."
                                    emptyMessage="No permissions found."
                                    maxBadges={4}
                                />
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

            <SuccessNotification
                open={!!successNotification}
                onOpenChange={(open) => !open && setSuccessNotification(null)}
                variant={successNotification?.variant ?? 'created'}
                resourceName="Role"
            />
        </AppLayout>
    );
}