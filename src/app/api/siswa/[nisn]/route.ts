import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nisn: string }> }
) {
  const { nisn } = await context.params;

  try {
    const siswa = await prisma.dataSiswa.findUnique({
      where: { nisn },
    });

    if (!siswa) {
      return NextResponse.json(
        { success: false, message: "Data siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: siswa });
  } catch (error) {
    console.error("Error fetching siswa:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data siswa" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ nisn: string }> }
) {
  const user = await getCurrentUser();
  const { nisn } = await context.params;
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "siswa.edit");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  if (user.role != "PRINCIPAL" && user.role != "ADMIN") {
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

    const siswa = await prisma.dataSiswa.update({
      where: { nisn: nisn },
      data: {
        nama: body.nama,
        kelas: body.kelas,
        jurusan: body.jurusan,
        no_hp: body.no_hp || null,
        jenis_kelamin: body.jenis_kelamin,
        tempat_lahir: body.tempat_lahir || null,
        tanggal_lahir: new Date(body.tanggal_lahir),
        alamat: body.alamat || null,
        image: body.image || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diperbarui",
      data: siswa,
    });
  } catch (error) {
    console.error("Error updating siswa:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data siswa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ nisn: string }> }
) {
  const user = await getCurrentUser();
  const { nisn } = await context.params;
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "siswa.delete");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  if (user.role != "PRINCIPAL" && user.role != "ADMIN") {
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
    await prisma.dataSiswa.delete({
      where: { nisn: nisn },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting siswa:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data siswa" },
      { status: 500 }
    );
  }
}
