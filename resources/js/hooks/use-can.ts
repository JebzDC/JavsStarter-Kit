import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function useCan() {
    const { auth } = usePage<SharedData>().props;

    /**
     * Check if the user has a specific permission
     */
    const can = (permission: string): boolean => {
        return auth?.permissions?.includes(permission) ?? false;
    };

    /**
     * Check if the user has any of the given permissions
     */
    const canAny = (permissions: string[]): boolean => {
        return permissions.some((permission) => can(permission));
    };

    /**
     * Check if the user has all of the given permissions
     */
    const canAll = (permissions: string[]): boolean => {
        return permissions.every((permission) => can(permission));
    };

    /**
     * Check if the user has a specific role
     */
    const hasRole = (role: string): boolean => {
        return auth?.roles?.includes(role) ?? false;
    };

    /**
     * Check if the user has any of the given roles
     */
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some((role) => hasRole(role));
    };

    /**
     * Check if the user has all of the given roles
     */
    const hasAllRoles = (roles: string[]): boolean => {
        return roles.every((role) => hasRole(role));
    };

    return {
        can,
        canAny,
        canAll,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        permissions: auth?.permissions ?? [],
        roles: auth?.roles ?? [],
    };
}
