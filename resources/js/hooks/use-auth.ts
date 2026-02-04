import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

/**
 * Check if the current user has a permission (Spatie).
 * Use in TSX: {useCan('edit articles') && <Button>Edit</Button>}
 */
export function useCan(permission: string): boolean {
    const { auth } = usePage<SharedData>().props;
    const can = auth?.can ?? {};
    return Boolean(can[permission]);
}

/**
 * Check if the current user has a role (Spatie).
 * Use in TSX: {useRole('admin') && <AdminLink />}
 */
export function useRole(role: string): boolean {
    const { auth } = usePage<SharedData>().props;
    const roles = auth?.roles ?? [];
    return roles.includes(role);
}

/**
 * Check if the current user has any of the given roles.
 */
export function useHasAnyRole(roles: string[]): boolean {
    const { auth } = usePage<SharedData>().props;
    const userRoles = auth?.roles ?? [];
    return roles.some((r) => userRoles.includes(r));
}

/**
 * Check if the current user has all of the given roles.
 */
export function useHasAllRoles(roles: string[]): boolean {
    const { auth } = usePage<SharedData>().props;
    const userRoles = auth?.roles ?? [];
    return roles.every((r) => userRoles.includes(r));
}

/**
 * Get auth.can and auth.roles for direct checks (e.g. can['edit posts']).
 * Use for dynamic permissions and roles.
 */
export function useAuthPermissions() {
    const { auth } = usePage<SharedData>().props;
    const can = auth?.can ?? {};
    const roles = auth?.roles ?? [];

    return {
        can,
        roles,
        canPermission: (permission: string) => Boolean(can[permission]),
        canAny: (permissionsList: string[]) => permissionsList.some((p) => can[p]),
        canAll: (permissionsList: string[]) => permissionsList.every((p) => can[p]),
        hasRole: (role: string) => roles.includes(role),
        hasAnyRole: (rolesList: string[]) => rolesList.some((r) => roles.includes(r)),
        hasAllRoles: (rolesList: string[]) => rolesList.every((r) => roles.includes(r)),
    };
}
