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
    const program = await prisma.programSekolah.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Data program tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data program" },
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
    const { tipe_program } = body;

    let permissionName = "";
    if (tipe_program === "Kurikulum") {
      permissionName = "program.kurikulum.edit";
    } else if (tipe_program === "Sarpras") {
      permissionName = "program.sarpras.edit";
    } else if (tipe_program === "Siswa") {
      permissionName = "program.siswa.edit";
    } else if (tipe_program === "Humas") {
      permissionName = "program.humas.edit";
    }

    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk mengedit program ini",
        },
        { status: 403 }
      );
    }

    const program = await prisma.programSekolah.update({
      where: { id },
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi,
        tipe_program: body.tipe_program,
        thumbnail: body.thumbnail || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data program berhasil diperbarui",
      data: program,
    });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data program" },
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
    const program = await prisma.programSekolah.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Data program tidak ditemukan" },
        { status: 404 }
      );
    }

    let permissionName = "";
    if (program.tipe_program === "Kurikulum") {
      permissionName = "program.kurikulum.delete";
    } else if (program.tipe_program === "Sarpras") {
      permissionName = "program.sarpras.delete";
    } else if (program.tipe_program === "Siswa") {
      permissionName = "program.siswa.delete";
    } else if (program.tipe_program === "Humas") {
      permissionName = "program.humas.delete";
    }

    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk menghapus program ini",
        },
        { status: 403 }
      );
    }

    await prisma.programSekolah.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data program berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data program" },
      { status: 500 }
    );
  }
}
