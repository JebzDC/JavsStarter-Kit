// import { NavFooter } from '@/components/nav-footer';
import { useAuthPermissions } from '@/hooks/use-auth';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as createPermissions } from '@/routes/admin/permissions';
import { index as createRoles } from '@/routes/admin/roles';
import { index as createUser } from '@/routes/admin/users';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Key, LayoutGrid, User, UserIcon } from 'lucide-react';
import AppLogo from './app-logo';

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { canPermission } = useAuthPermissions();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(canPermission('manage users')
            ? [{ title: 'Create User', href: createUser(), icon: UserIcon }]
            : []),
        ...(canPermission('manage roles')
            ? [{ title: 'Create Roles ', href: createRoles(), icon: Key }]
            : []),
        // ...(canPermission('manage permissions')
        //     ? [{ title: 'Create Permissions', href: createPermissions(), icon: Folder }]
        //     : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="sticky bottom-0 mt-auto border-t border-sidebar-border bg-sidebar py-2">
                <NavUser variant="sidebar" />
            </SidebarFooter>
        </Sidebar>
    );
}
