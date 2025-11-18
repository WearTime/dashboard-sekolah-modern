import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";
import { prisma } from "WT/lib/prisma";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; galleryId: string }> }
) {
  const user = await getCurrentUser();
  const { galleryId } = await context.params;

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.delete");

  if (!userPermis) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    await prisma.ekstrakulikulerGallery.delete({
      where: { id: galleryId },
    });

    return NextResponse.json({
      success: true,
      message: "Foto galeri berhasil dihapus",
    });
  } catch (error) {
    console.error("Error delete ekstrakulikuler gallery:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menghapus foto galeri" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; galleryId: string }> }
) {
  const user = await getCurrentUser();
  const { galleryId } = await context.params;

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.edit");

  if (!userPermis) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const gallery = await prisma.ekstrakulikulerGallery.update({
      where: { id: galleryId },
      data: {
        caption: body.caption,
        order: body.order,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Foto galeri berhasil diperbarui",
      data: gallery,
    });
  } catch (error) {
    console.error("Error update ekstrakulikuler gallery:", error);

    return NextResponse.json(
      { success: false, message: "Gagal memperbarui foto galeri" },
      { status: 500 }
    );
  }
}
