import { SessionUser } from "WT/types";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const hasPermission = async (
  userId: number,
  permissionName: string
): Promise<boolean> => {
  const permission = await prisma.userPermissions.findFirst({
    where: {
      userId,
      permission: {
        name: permissionName,
      },
    },
  });

  return !!permission;
};

export const hasAnyPermission = async (
  userId: number,
  permissionNames: string[]
): Promise<boolean> => {
  const count = await prisma.userPermissions.count({
    where: {
      userId,
      permission: {
        name: {
          in: permissionNames,
        },
      },
    },
  });

  return count > 0;
};

export const hasAllPermissions = async (
  userId: number,
  permissionNames: string[]
): Promise<boolean> => {
  const count = await prisma.userPermissions.count({
    where: {
      userId,
      permission: {
        name: {
          in: permissionNames,
        },
      },
    },
  });

  return count === permissionNames.length;
};

export const getUserPermissions = async (userId: number): Promise<string[]> => {
  const userPermissions = await prisma.userPermissions.findMany({
    where: { userId },
    include: {
      permission: true,
    },
  });

  return userPermissions.map((up) => up.permission.name);
};

export const matchPermissionPattern = async (
  userPermissions: string[],
  pattern: string
): Promise<boolean> => {
  if (userPermissions.includes(pattern)) return true;

  if (pattern.includes("*")) {
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
    return userPermissions.some((perm) => regex.test(perm));
  }

  return false;
};

export const checkPermission = async (
  userPermissions: string[] | undefined,
  requiredPermission: string | undefined
): Promise<boolean> => {
  if (!requiredPermission) return true;
  if (!userPermissions) return false;

  return matchPermissionPattern(userPermissions, requiredPermission);
};
