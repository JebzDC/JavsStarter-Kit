import { Link } from '@inertiajs/react';
import { Key, LayoutGrid, Shield, Users } from 'lucide-react';
import { useMemo } from 'react';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCan } from '@/hooks/use-can';
import { dashboard } from '@/routes';
import { index as permissionsIndex } from '@/routes/admin/permissions';
import { index as rolesIndex } from '@/routes/admin/roles';
import { index as usersIndex } from '@/routes/admin/users';
import type { NavItem } from '@/types';
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
    const { can, hasRole } = useCan();

    const mainNavItems: NavItem[] = useMemo(() => {
        const items: NavItem[] = [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ];

        // Admin section - show if user has permission or is admin
        if (can('users.view') || can('manage users') || hasRole('admin') || hasRole('super-admin')) {
            items.push({
                title: 'Users',
                href: usersIndex(),
                icon: Users,
            });
        }
        
        if (can('manage roles') || can('roles.view') || hasRole('admin') || hasRole('super-admin')) {
            items.push({
                title: 'Roles',
                href: rolesIndex(),
                icon: Shield,
            });
        }

        if (can('manage permissions') || can('permissions.view') || hasRole('admin') || hasRole('super-admin')) {
            items.push({
                title: 'Permissions',
                href: permissionsIndex(),
                icon: Key,
            });
        }

        return items;
    }, [can, hasRole]);

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
        </Sidebar>
    );
}
