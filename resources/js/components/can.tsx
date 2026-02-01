import type { ReactNode } from 'react';
import { useCan } from '@/hooks/use-can';

interface CanProps {
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
    const { can, canAny, canAll, hasRole, hasAnyRole, hasAllRoles } = useCan();

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
