"use client";

import { ReactNode } from "react";
import { SessionUser } from "WT/types";
import { usePermission } from "WT/hooks/usePermission";
import { forbidden } from "next/navigation";

interface ProtectedComponentProps {
  user: SessionUser | null | undefined;
  permission: string | string[];
  children: ReactNode;
  requireAll?: boolean;
}
const ProtectedComponent = ({
  user,
  permission,
  children,
  requireAll = false,
}: ProtectedComponentProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermission(user);

  if (typeof permission === "string") {
    return hasPermission(permission) ? <>{children}</> : null;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(permission)
    : hasAnyPermission(permission);

  return hasAccess ? <>{children}</> : null;
};

export default ProtectedComponent;
