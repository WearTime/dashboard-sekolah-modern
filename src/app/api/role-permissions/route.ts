import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userPermis = await hasPermission(user.id, "users.view");
    if (!userPermis) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const rolePermissions = await prisma.rolePermissions.findMany({
      include: {
        permission: true,
      },
    });

    const groupedByRole: Record<string, string[]> = {
      ADMIN: [],
      TEACHER: [],
      PRINCIPAL: [],
    };

    rolePermissions.forEach((rp) => {
      if (!groupedByRole[rp.role]) {
        groupedByRole[rp.role] = [];
      }
      groupedByRole[rp.role].push(rp.permission.name);
    });

    return NextResponse.json({
      success: true,
      data: groupedByRole,
    });
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data role permissions" },
      { status: 500 }
    );
  }
}
