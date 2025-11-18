import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const tipe_mapel = searchParams.get("tipe_mapel") || "";
    const jurusan = searchParams.get("jurusan") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nama_mapel: { contains: search } },
        { kode_mapel: { contains: search } },
      ];
    }

    if (tipe_mapel) {
      where.tipe_mapel = tipe_mapel;
    }

    if (jurusan) {
      where.jurusan = jurusan;
    }

    const [mapel, total] = await Promise.all([
      prisma.mapel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nama_mapel: "asc" },
        include: {
          guruandmapel: {
            include: {
              guru: {
                select: {
                  nip: true,
                  nama: true,
                },
              },
            },
          },
        },
      }),
      prisma.mapel.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: mapel,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching mapel:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data mapel" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

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
    const { guru_nips, ...mapelData } = body;

    const existingMapel = await prisma.mapel.findUnique({
      where: { kode_mapel: mapelData.kode_mapel },
    });

    if (existingMapel) {
      return NextResponse.json(
        { success: false, message: "Kode mapel sudah terdaftar" },
        { status: 400 }
      );
    }

    const mapel = await prisma.mapel.create({
      data: {
        kode_mapel: mapelData.kode_mapel,
        nama_mapel: mapelData.nama_mapel,
        fase: mapelData.fase,
        tipe_mapel: mapelData.tipe_mapel,
        jurusan: mapelData.jurusan,
        ...(Array.isArray(guru_nips) &&
          guru_nips.length > 0 && {
            guruandmapel: {
              create: guru_nips.map((nip: string) => ({
                nip_guru: nip,
              })),
            },
          }),
      },
      include: {
        guruandmapel: {
          include: {
            guru: {
              select: {
                nip: true,
                nama: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data mapel berhasil ditambahkan",
      data: mapel,
    });
  } catch (error) {
    console.error("Error creating mapel:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues?.[0]?.message || "Validasi gagal",
          errors: error.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan data mapel" },
      { status: 500 }
    );
  }
}
