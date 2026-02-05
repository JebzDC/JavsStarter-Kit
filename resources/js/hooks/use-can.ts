import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

/**
 * @deprecated Use useAuthPermissions() from '@/hooks/use-auth' for the same API (can, hasRole, etc.).
 * Permission checks now use auth.can (dynamic); roles use auth.roles.
 */
export function useCan() {
    const { auth } = usePage<SharedData>().props;
    const canRecord = auth?.can ?? {};
    const permissions = auth?.permissions ?? [];
    const roles = auth?.roles ?? [];

    const can = (permission: string): boolean =>
        Boolean(canRecord[permission] ?? permissions.includes(permission));

    const canAny = (permissionsList: string[]): boolean =>
        permissionsList.some((p) => can(p));

    const canAll = (permissionsList: string[]): boolean =>
        permissionsList.every((p) => can(p));

    const hasRole = (role: string): boolean => roles.includes(role);

    const hasAnyRole = (rolesList: string[]): boolean =>
        rolesList.some((r) => hasRole(r));

    const hasAllRoles = (rolesList: string[]): boolean =>
        rolesList.every((r) => hasRole(r));

    return {
        can,
        canAny,
        canAll,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        permissions,
        roles,
    };
}
