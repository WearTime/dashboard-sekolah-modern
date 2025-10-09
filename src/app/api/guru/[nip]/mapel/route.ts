import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nip: string }> }
) {
  const { nip } = await params;
  try {
    const guruMapel = await prisma.guruAndMapel.findMany({
      where: { nip_guru: nip },
      include: {
        mapel: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: guruMapel,
    });
  } catch (error) {
    console.error("Error fetching guru mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data mapel guru" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ nip: string }> }
) {
  const user = await getCurrentUser();
  const { nip } = await params;

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
    const { kode_mapel } = body;

    const guru = await prisma.dataGuru.findUnique({
      where: { nip },
    });

    if (!guru) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    const mapel = await prisma.mapel.findUnique({
      where: { kode_mapel },
    });

    if (!mapel) {
      return NextResponse.json(
        { success: false, message: "Mapel tidak ditemukan" },
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

    const guruMapel = await prisma.guruAndMapel.create({
      data: {
        nip_guru: nip,
        kode_mapel: kode_mapel,
      },
      include: {
        mapel: true,
        guru: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mapel berhasil ditambahkan ke guru",
      data: guruMapel,
    });
  } catch (error) {
    console.error("Error adding mapel to guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan mapel ke guru" },
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
    const searchParams = request.nextUrl.searchParams;
    const kode_mapel = searchParams.get("kode_mapel");

    if (!kode_mapel) {
      return NextResponse.json(
        { success: false, message: "Kode mapel tidak diberikan" },
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
      message: "Mapel berhasil dihapus dari guru",
    });
  } catch (error) {
    console.error("Error removing mapel from guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus mapel dari guru" },
      { status: 500 }
    );
  }
}
