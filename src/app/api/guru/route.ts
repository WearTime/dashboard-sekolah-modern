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
    const status = searchParams.get("status") || "";
    const jenis_kelamin = searchParams.get("jenis_kelamin") || "";
    const golongan = searchParams.get("golongan") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nip: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (golongan) {
      where.golongan = golongan;
    }

    if (jenis_kelamin) {
      where.jenis_kelamin = jenis_kelamin;
    }

    const [guru, total] = await Promise.all([
      prisma.dataGuru.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nama: "asc" },
      }),
      prisma.dataGuru.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: guru,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data guru" },
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

  const userPermis = await hasPermission(user.id, "guru.create");

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
    const { mapel_ids, ...guruData } = body;

    const existingGuru = await prisma.dataGuru.findUnique({
      where: { nip: guruData.nip },
    });

    if (existingGuru) {
      return NextResponse.json(
        { success: false, message: "NIP sudah terdaftar" },
        { status: 400 }
      );
    }

    const guru = await prisma.dataGuru.create({
      data: {
        nip: guruData.nip,
        nama: guruData.nama,
        no_hp: guruData.no_hp || null,
        alamat: guruData.alamat || null,
        jenis_kelamin: guruData.jenis_kelamin,
        image: guruData.image || null,
        status: guruData.status,
        golongan: guruData.golongan || null,
        ...(Array.isArray(mapel_ids) &&
          mapel_ids.length > 0 && {
            guruandmapel: {
              create: mapel_ids.map((kode_mapel: string) => ({
                kode_mapel: kode_mapel,
              })),
            },
          }),
      },
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
      message: "Data guru berhasil ditambahkan",
      data: guru,
    });
  } catch (error) {
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
      { success: false, message: "Gagal menambahkan data guru" },
      { status: 500 }
    );
  }
}
