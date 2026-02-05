import type { ReactNode } from 'react';
import { useAuthPermissions } from '@/hooks/use-auth';

export interface CanProps {
    permission?: string | string[];
    role?: string | string[];
    children: ReactNode;
    fallback?: ReactNode;
    matchAll?: boolean;
}

/**
 * Component to conditionally render children based on user permissions or roles.
 *
 * @example
 * // Single permission
 * <Can permission="edit articles">
 *     <button>Edit</button>
 * </Can>
 *
 * @example
 * // Multiple permissions (any)
 * <Can permission={['edit articles', 'delete articles']}>
 *     <button>Manage</button>
 * </Can>
 *
 * @example
 * // Multiple permissions (all required)
 * <Can permission={['edit articles', 'publish articles']} matchAll>
 *     <button>Edit & Publish</button>
 * </Can>
 *
 * @example
 * // Role check
 * <Can role="admin">
 *     <AdminPanel />
 * </Can>
 *
 * @example
 * // With fallback
 * <Can permission="manage users" fallback={<span>No access</span>}>
 *     <UserManagement />
 * </Can>
 */
export function Can({ permission, role, children, fallback = null, matchAll = false }: CanProps) {
    const { canPermission, canAny, canAll, hasRole, hasAnyRole, hasAllRoles } =
        useAuthPermissions();
    const can = canPermission;

    let hasAccess = false;

    // Check permissions
    if (permission) {
        if (Array.isArray(permission)) {
            hasAccess = matchAll ? canAll(permission) : canAny(permission);
        } else {
            hasAccess = can(permission);
        }
    }

    // Check roles (if permission didn't grant access)
    if (!hasAccess && role) {
        if (Array.isArray(role)) {
            hasAccess = matchAll ? hasAllRoles(role) : hasAnyRole(role);
        } else {
            hasAccess = hasRole(role);
        }
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Renders children when the user does NOT have the given permission or role.
 * Like Blade's @cannot directive.
 *
 * @example
 * <Cannot permission="manage users">
 *     <span>You cannot manage users</span>
 * </Cannot>
 *
 * @example
 * <Cannot role="admin">
 *     <GuestContent />
 * </Cannot>
 */
export function Cannot({
    permission,
    role,
    children,
    fallback = null,
    matchAll = false,
}: CanProps) {
    const { canPermission, canAny, canAll, hasRole, hasAnyRole, hasAllRoles } =
        useAuthPermissions();
    const can = canPermission;

    let hasAccess = false;
    if (permission) {
        if (Array.isArray(permission)) {
            hasAccess = matchAll ? canAll(permission) : canAny(permission);
        } else {
            hasAccess = can(permission);
        }
    }
    if (!hasAccess && role) {
        if (Array.isArray(role)) {
            hasAccess = matchAll ? hasAllRoles(role) : hasAnyRole(role);
        } else {
            hasAccess = hasRole(role);
        }
    }

    return !hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Shorthand for role-based visibility. Renders children when user has the given role(s).
 * Like Blade's @role directive.
 *
 * @example
 * <HasRole role="editor">
 *     <EditorTools />
 * </HasRole>
 *
 * @example
 * <HasRole role={['admin', 'super-admin']}>
 *     <AdminSection />
 * </HasRole>
 */
export function HasRole({
    role,
    children,
    fallback = null,
    matchAll = false,
}: Omit<CanProps, 'permission'>) {
    return (
        <Can role={role} fallback={fallback} matchAll={matchAll}>
            {children}
        </Can>
    );
}
