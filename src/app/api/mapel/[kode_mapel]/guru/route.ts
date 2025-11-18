import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ kode_mapel: string }>;
  }
) {
  const { kode_mapel } = await params;

  try {
    const mapelGuru = await prisma.guruAndMapel.findMany({
      where: { kode_mapel: kode_mapel },
      include: {
        guru: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapelGuru,
    });
  } catch (error) {
    console.error("Error fetching mapel guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data guru mapel" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ kode_mapel: string }> }
) {
  const user = await getCurrentUser();
  const { kode_mapel } = await params;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "mapel.create");

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
    const { nip } = body;

    const mapel = await prisma.mapel.findUnique({
      where: { kode_mapel },
    });

    if (!mapel) {
      return NextResponse.json(
        { success: false, message: "Mapel tidak ditemukan" },
        { status: 404 }
      );
    }

    const guru = await prisma.dataGuru.findUnique({
      where: { nip },
    });

    if (!guru) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    const existingRelation = await prisma.guruAndMapel.findUnique({
      where: {
        kode_mapel_nip_guru: {
          kode_mapel: kode_mapel,
          nip_guru: nip,
        },
      },
    });

    if (existingRelation) {
      return NextResponse.json(
        { success: false, message: "Guru sudah mengajar mapel ini" },
        { status: 400 }
      );
    }

    const mapelGuru = await prisma.guruAndMapel.create({
      data: {
        kode_mapel: kode_mapel,
        nip_guru: nip,
      },
      include: {
        mapel: true,
        guru: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Guru berhasil ditambahkan ke mapel",
      data: mapelGuru,
    });
  } catch (error) {
    console.error("Error adding guru to mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan guru ke mapel" },
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
    const searchParams = request.nextUrl.searchParams;
    const nip = searchParams.get("nip");

    if (!nip) {
      return NextResponse.json(
        { success: false, message: "NIP tidak diberikan" },
        { status: 400 }
      );
    }

    await prisma.guruAndMapel.delete({
      where: {
        kode_mapel_nip_guru: {
          kode_mapel: kode_mapel,
          nip_guru: nip,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Guru berhasil dihapus dari mapel",
    });
  } catch (error) {
    console.error("Error removing guru from mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus guru dari mapel" },
      { status: 500 }
    );
  }
}
