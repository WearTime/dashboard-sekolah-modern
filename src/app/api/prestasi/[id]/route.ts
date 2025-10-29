import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const prestasi = await prisma.prestasi.findUnique({
      where: { id },
    });

    if (!prestasi) {
      return NextResponse.json(
        {
          success: false,
          message: "Data prestasi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: prestasi });
  } catch (error) {
    console.error("Error fetching prestasi:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data prestasi" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  const { id } = await context.params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "prestasi.edit");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  if (user.role !== "PRINCIPAL" && user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body = await request.json();

    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        penyelenggara: body.penyelenggara,
        recipient_type: body.recipient_type,
        level: body.level,
        tanggal: new Date(body.tanggal),
        image: body.image || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data prestasi berhasil diperbarui",
      data: prestasi,
    });
  } catch (error) {
    console.error("Error updating prestasi:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data prestasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  const { id } = await context.params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "prestasi.delete");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  if (user.role !== "PRINCIPAL" && user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  try {
    await prisma.prestasi.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data prestasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting prestasi:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data prestasi" },
      { status: 500 }
    );
  }
}
