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
    const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
      where: { id },
    });

    if (!ekstrakulikuler) {
      return NextResponse.json(
        {
          success: false,
          message: "Data ekstrakulikuler tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ekstrakulikuler });
  } catch (error) {
    console.error("Error fetching ekstrakulikuler:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data ekstrakulikuler" },
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

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.edit");

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

    const ekstrakulikuler = await prisma.ekstrakulikuler.update({
      where: { id },
      data: {
        namaEskul: body.namaEskul,
        pendamping: body.pendamping,
        ketua: body.ketua,
        description: body.description,
        imagesThumbnail: body.imagesThumbnail || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data ekstrakulikuler berhasil diperbarui",
      data: ekstrakulikuler,
    });
  } catch (error) {
    console.error("Error updating ekstrakulikuler:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data ekstrakulikuler" },
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

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.delete");

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
    await prisma.ekstrakulikuler.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data ekstrakulikuler berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting ekstrakulikuler:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data ekstrakulikuler" },
      { status: 500 }
    );
  }
}
