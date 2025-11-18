import { useCallback, useMemo } from "react";
import { SessionUser } from "WT/types";

interface UsePermissionReturn {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canView: (resource: string) => boolean;
  canCreate: (resource: string) => boolean;
  canEdit: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canExport: (resource: string) => boolean;
  canImport: (resource: string) => boolean;
}

export const usePermission = (
  user: SessionUser | null | undefined
): UsePermissionReturn => {
  const userPermissions = useMemo(() => {
    return user?.permissions || [];
  }, [user?.permissions]);

  const matchPermissionPattern = useCallback(
    (pattern: string): boolean => {
      if (!user || userPermissions.length === 0) return false;

      if (userPermissions.includes(pattern)) return true;

      if (pattern.includes("*")) {
        const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
        return userPermissions.some((perm) => regex.test(perm));
      }

      return userPermissions.some((userPerm) => {
        if (userPerm.includes("*")) {
          const regex = new RegExp("^" + userPerm.replace(/\*/g, ".*") + "$");
          return regex.test(pattern);
        }
        return false;
      });
    },
    [user, userPermissions]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return matchPermissionPattern(permission);
    },
    [matchPermissionPattern]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((perm) => matchPermissionPattern(perm));
    },
    [matchPermissionPattern]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((perm) => matchPermissionPattern(perm));
    },
    [matchPermissionPattern]
  );

  const canView = useCallback(
    (resource: string): boolean => {
      return hasPermission(`${resource}.view`);
    },
    [hasPermission]
  );

  const canCreate = useCallback(
    (resource: string): boolean => {
      return hasPermission(`${resource}.create`);
    },
    [hasPermission]
  );

  const canEdit = useCallback(
    (resource: string): boolean => {
      return hasPermission(`${resource}.edit`);
    },
    [hasPermission]
  );

  const canDelete = useCallback(
    (resource: string): boolean => {
      return hasPermission(`${resource}.delete`);
    },
    [hasPermission]
  );

  const canExport = useCallback(
    (resource: string): boolean => {
      return hasPermission(`${resource}.export`);
    },
    [hasPermission]
  );

  const canImport = useCallback(
    (resource: string): boolean => {
      return hasPermission(`${resource}.import`);
    },
    [hasPermission]
  );

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canImport,
  };
};
