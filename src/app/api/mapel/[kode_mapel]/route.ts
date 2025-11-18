import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ kode_mapel: string }> }
) {
  const { kode_mapel } = await context.params;

  try {
    const mapel = await prisma.mapel.findUnique({
      where: { kode_mapel },
      include: {
        guruandmapel: {
          include: {
            guru: true,
          },
        },
      },
    });

    if (!mapel) {
      return NextResponse.json(
        { success: false, message: "Data mapel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mapel });
  } catch (error) {
    console.error("Error fetching mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data mapel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ kode_mapel: string }> }
) {
  const user = await getCurrentUser();
  const { kode_mapel } = await context.params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "mapel.edit");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { guru_nips, ...mapelData } = body;

    await prisma.mapel.update({
      where: { kode_mapel: kode_mapel },
      data: {
        nama_mapel: mapelData.nama_mapel,
        fase: mapelData.fase,
        tipe_mapel: mapelData.tipe_mapel,
        jurusan: mapelData.jurusan,
      },
    });

    if (Array.isArray(guru_nips)) {
      await prisma.guruAndMapel.deleteMany({
        where: { kode_mapel: kode_mapel },
      });

      if (guru_nips.length > 0) {
        await prisma.guruAndMapel.createMany({
          data: guru_nips.map((nip: string) => ({
            kode_mapel: kode_mapel,
            nip_guru: nip,
          })),
          skipDuplicates: true,
        });
      }
    }

    const updatedMapel = await prisma.mapel.findUnique({
      where: { kode_mapel },
      include: {
        guruandmapel: {
          include: {
            guru: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data mapel berhasil diperbarui",
      data: updatedMapel,
    });
  } catch (error) {
    console.error("Error updating mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data mapel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ kode_mapel: string }> }
) {
  const user = await getCurrentUser();
  const { kode_mapel } = await context.params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "mapel.delete");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  try {
    await prisma.mapel.delete({
      where: { kode_mapel: kode_mapel },
    });

    return NextResponse.json({
      success: true,
      message: "Data mapel berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data mapel" },
      { status: 500 }
    );
  }
}
