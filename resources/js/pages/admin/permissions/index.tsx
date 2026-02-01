import { Head, router, useForm } from '@inertiajs/react';
import { 
    Edit2, 
    Key, 
    Plus, 
    Search, 
    ShieldCheck, 
    Trash2, 
    MoreHorizontal,
    LayoutGrid
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
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

    // Optimized Grouping & Search logic
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

            <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-8 lg:p-10">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Access Control</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Permissions</h1>
                        <p className="max-w-prose text-muted-foreground">
                            Define granular access levels using dot notation (e.g., <code className="text-primary">users.edit</code>).
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Filter permissions..."
                                className="h-11 pl-10 shadow-sm"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-11 px-5 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleCreate}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Permission</DialogTitle>
                                        <DialogDescription>Group permissions by name prefix.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="create-name">Technical Name</Label>
                                            <Input 
                                                id="create-name" 
                                                placeholder="e.g. orders.cancel"
                                                value={createForm.data.name} 
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('name', e.target.value)} 
                                            />
                                            <InputError message={createForm.errors.name} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={createForm.processing} className="w-full">Create Permission</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Separator className="opacity-50" />

                {/* --- PERMISSIONS GRID --- */}
                <div className="grid gap-10">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                        <div key={group} className="space-y-5">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <LayoutGrid className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-xl font-bold capitalize tracking-tight text-foreground">{group}</h2>
                                </div>
                                <Badge variant="secondary" className="px-3 py-1 font-mono text-xs">
                                    {perms.length} Items
                                </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {perms.map((permission) => (
                                    <div 
                                        key={permission.id} 
                                        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 shadow-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="rounded-lg bg-muted/50 p-2 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                                                    <Key className="h-4 w-4" />
                                                </div>
                                                
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => {
                                                            editForm.setData({ name: permission.name });
                                                            setEditingPermission(permission);
                                                        }}>
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
                                            
                                            <div className="space-y-1">
                                                <p className="truncate text-sm font-bold text-foreground">
                                                    {permission.name}
                                                </p>
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                                    System Access
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* --- EMPTY STATE --- */}
                {Object.keys(groupedPermissions).length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/60 bg-muted/5 py-24 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                            <Key className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">No permissions found</h3>
                        <p className="mt-2 text-muted-foreground">Try searching for a different name or create a new entry.</p>
                        <Button variant="outline" className="mt-8" onClick={() => setSearchQuery('')}>
                            Clear Search
                        </Button>
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}
            
            {/* Edit Dialog */}
            <Dialog open={!!editingPermission} onOpenChange={(open) => !open && setEditingPermission(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Permission</DialogTitle>
                            <DialogDescription>Update technical name for this capability.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Technical Name</Label>
                                <Input 
                                    id="edit-name" 
                                    value={editForm.data.name} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('name', e.target.value)} 
                                />
                                <InputError message={editForm.errors.name} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={editForm.processing} className="w-full">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;<span className="font-bold text-foreground">{deleteConfirm?.name}</span>&quot;? This action will remove access for all assigned roles.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}