import { Head, router, useForm } from '@inertiajs/react';
import {
    Edit2,
    Key,
    LayoutGrid,
    Layers,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    MoreHorizontal,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { StatCard } from '@/components/stat-card';
import { TableCard } from '@/components/table-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index, store, update, destroy } from '@/routes/admin/permissions';
import type { BreadcrumbItem, Permission } from '@/types';

interface PermissionsIndexProps {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Settings', href: '#' },
    { title: 'Permissions', href: index().url },
];

export default function PermissionsIndex({ permissions }: PermissionsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Permission | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const createForm = useForm({ name: '' });
    const editForm = useForm({ name: '' });

    const groupCount = useMemo(() => {
        const groups = new Set(
            permissions.map((p) => {
                const [g] = p.name.split(/[.\s-]/);
                return g || 'general';
            })
        );
        return groups.size;
    }, [permissions]);

    const groupedPermissions = useMemo(() => {
        const filtered = permissions.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filtered.reduce((groups, permission) => {
            const [group] = permission.name.split(/[.\s-]/);
            const key = group || 'general';
            if (!groups[key]) groups[key] = [];
            groups[key].push(permission);
            return groups;
        }, {} as Record<string, Permission[]>);
    }, [permissions, searchQuery]);

    const totalFiltered = useMemo(
        () => Object.values(groupedPermissions).reduce((sum, arr) => sum + arr.length, 0),
        [groupedPermissions]
    );

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
        if (!editingPermission) return;
        editForm.put(update(editingPermission.id).url, {
            onSuccess: () => {
                setEditingPermission(null);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions Management" />

            <div className="w-full space-y-8 px-6 py-6 md:px-4">
                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Permissions
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Define granular access levels using dot notation (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">users.edit</code>).
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Total Permissions"
                        value={permissions.length}
                        subtext="Defined access points"
                        icon={ShieldCheck}
                        variant="cyan"
                    />
                    <StatCard
                        label="Permission Groups"
                        value={groupCount}
                        subtext="Categories by prefix"
                        icon={Layers}
                        variant="green"
                    />
                    <StatCard
                        label="Avg per Group"
                        value={groupCount > 0 ? Math.round(permissions.length / groupCount) : 0}
                        subtext="Permissions per category"
                        icon={Key}
                        variant="pink"
                    />
                </div>

                {/* Permissions by category */}
                <TableCard
                    title="Permissions by category"
                    count={totalFiltered}
                    defaultOpen
                    headerRight={
                        <>
                            <div className="relative w-full min-w-0 sm:w-48">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Filter permissions..."
                                    className="h-9 w-full bg-muted/50 pl-9 text-sm"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="h-9 shrink-0 gap-1.5 font-medium">
                                        <Plus className="h-4 w-4" />
                                        New permission
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <form onSubmit={handleCreate}>
                                        <DialogHeader>
                                            <DialogTitle>Add new permission</DialogTitle>
                                            <DialogDescription>
                                                Use dot notation to group by prefix (e.g. <code className="text-foreground">orders.cancel</code>).
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="create-name">Technical name</Label>
                                                <Input
                                                    id="create-name"
                                                    className="h-9"
                                                    placeholder="e.g. orders.cancel"
                                                    value={createForm.data.name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('name', e.target.value)}
                                                />
                                                <InputError message={createForm.errors.name} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={createForm.processing} className="w-full">
                                                Create permission
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </>
                    }
                >
                    {Object.keys(groupedPermissions).length > 0 ? (
                        <div className="space-y-8 p-5">
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                                <div key={group} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <LayoutGrid className="h-4 w-4" />
                                            </div>
                                            <h2 className="text-sm font-semibold capitalize tracking-tight text-foreground">
                                                {group}
                                            </h2>
                                        </div>
                                        <Badge variant="secondary" className="px-2.5 py-0.5 font-mono text-xs">
                                            {perms.length}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {perms.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="group flex items-start justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:border-border hover:bg-muted/40 dark:bg-muted/10 dark:hover:bg-muted/20"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                                                        <Key className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {permission.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">System access</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                editForm.setData({ name: permission.name });
                                                                setEditingPermission(permission);
                                                            }}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onClick={() => setDeleteConfirm(permission)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center border-t border-border/60 py-16 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <Key className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No permissions found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try a different search or create a new permission.
                            </p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearchQuery('')}>
                                Clear search
                            </Button>
                        </div>
                    )}
                </TableCard>
            </div>

            {/* --- MODALS --- */}
            
            {/* Edit Dialog */}
            <Dialog open={!!editingPermission} onOpenChange={(open) => !open && setEditingPermission(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit permission</DialogTitle>
                            <DialogDescription>Update the technical name for this capability.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Technical name</Label>
                                <Input
                                    id="edit-name"
                                    className="h-9"
                                    value={editForm.data.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('name', e.target.value)}
                                />
                                <InputError message={editForm.errors.name} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={editForm.processing} className="w-full">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;<span className="font-semibold text-foreground">{deleteConfirm?.name}</span>&quot;? This will remove it from all assigned roles.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}