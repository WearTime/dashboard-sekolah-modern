import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nip: string }> }
) {
  const { nip } = await context.params;

  try {
    const guru = await prisma.dataGuru.findUnique({
      where: { nip },
      include: {
        guruandmapel: {
          include: {
            mapel: true,
          },
        },
        StructurOrganisasi: true,
      },
    });

    if (!guru) {
      return NextResponse.json(
        { success: false, message: "Data guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: guru });
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data guru" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ nip: string }> }
) {
  const user = await getCurrentUser();
  const { nip } = await context.params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
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
    const { mapel_ids, ...guruData } = body;

    const guru = await prisma.dataGuru.update({
      where: { nip: nip },
      data: {
        nama: guruData.nama,
        no_hp: guruData.no_hp || null,
        alamat: guruData.alamat || null,
        jenis_kelamin: guruData.jenis_kelamin,
        image: guruData.image || null,
        status: guruData.status,
        golongan: guruData.golongan || null,
      },
    });

    if (Array.isArray(mapel_ids)) {
      await prisma.guruAndMapel.deleteMany({
        where: { nip_guru: nip },
      });

      if (mapel_ids.length > 0) {
        await prisma.guruAndMapel.createMany({
          data: mapel_ids.map((kode_mapel: string) => ({
            nip_guru: nip,
            kode_mapel: kode_mapel,
          })),
          skipDuplicates: true,
        });
      }
    }

    const updatedGuru = await prisma.dataGuru.findUnique({
      where: { nip },
      include: {
        guruandmapel: {
          include: {
            mapel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil diperbarui",
      data: updatedGuru,
    });
  } catch (error) {
    console.error("Error updating guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data guru" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ nip: string }> }
) {
  const user = await getCurrentUser();
  const { nip } = await context.params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
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
    await prisma.dataGuru.delete({
      where: { nip: nip },
    });

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data guru" },
      { status: 500 }
    );
  }
}
