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
    const program = await prisma.programJurusan.findUnique({
      where: { id },
      include: {
        jurusan: true,
      },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Data program jurusan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error("Error fetching program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data program jurusan" },
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

    const existingProgram = await prisma.programJurusan.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { success: false, message: "Data program jurusan tidak ditemukan" },
        { status: 404 }
      );
    }

    const permissionName = `program.jurusan.${existingProgram.kode_jurusan}.edit`;
    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk mengedit program jurusan ini",
        },
        { status: 403 }
      );
    }

    const program = await prisma.programJurusan.update({
      where: { id },
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi,
        thumbnail: body.thumbnail || "",
      },
      include: {
        jurusan: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data program jurusan berhasil diperbarui",
      data: program,
    });
  } catch (error) {
    console.error("Error updating program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data program jurusan" },
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
    const program = await prisma.programJurusan.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Data program jurusan tidak ditemukan" },
        { status: 404 }
      );
    }

    const permissionName = `program.jurusan.${program.kode_jurusan}.delete`;
    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk menghapus program jurusan ini",
        },
        { status: 403 }
      );
    }

    await prisma.programJurusan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data program jurusan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data program jurusan" },
      { status: 500 }
    );
  }
}
