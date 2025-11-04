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
        { success: false, message: "Data prestasi tidak ditemukan" },
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
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { recipient_type, level } = body;

    let permissionName = "";
    if (recipient_type === "Siswa") {
      const levelLower = level.toLowerCase();
      permissionName = `prestasi.siswa.${levelLower}.edit`;
    } else if (recipient_type === "Sekolah") {
      const levelLower = level.toLowerCase();
      permissionName = `prestasi.sekolah.${levelLower}.edit`;
    } else if (recipient_type === "GTK") {
      const levelLower = level.toLowerCase();
      permissionName = `prestasi.gtk.${levelLower}.edit`;
    }

    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk mengedit prestasi ini",
        },
        { status: 403 }
      );
    }

    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        penyelenggara: body.penyelenggara,
        recipient_type: body.recipient_type,
        nama_penerima: body.nama_penerima,
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
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const prestasi = await prisma.prestasi.findUnique({
      where: { id },
    });

    if (!prestasi) {
      return NextResponse.json(
        { success: false, message: "Data prestasi tidak ditemukan" },
        { status: 404 }
      );
    }

    let permissionName = "";
    if (prestasi.recipient_type === "Siswa") {
      const levelLower = prestasi.level.toLowerCase();
      permissionName = `prestasi.siswa.${levelLower}.delete`;
    } else if (prestasi.recipient_type === "Sekolah") {
      const levelLower = prestasi.level.toLowerCase();
      permissionName = `prestasi.sekolah.${levelLower}.delete`;
    } else if (prestasi.recipient_type === "GTK") {
      const levelLower = prestasi.level.toLowerCase();
      permissionName = `prestasi.gtk.${levelLower}.delete`;
    }

    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk menghapus prestasi ini",
        },
        { status: 403 }
      );
    }

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
