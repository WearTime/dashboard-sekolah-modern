import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const kode_jurusan = searchParams.get("kode_jurusan") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { judul: { contains: search } },
        { deskripsi: { contains: search } },
      ];
    }

    if (kode_jurusan) {
      where.kode_jurusan = kode_jurusan;
    }

    const [programs, total] = await Promise.all([
      prisma.programJurusan.findMany({
        where,
        skip,
        take: limit,
        include: {
          jurusan: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.programJurusan.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: programs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data program jurusan" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { kode_jurusan } = body;

    const permissionName = `program.jurusan.${kode_jurusan}.create`;
    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk membuat program jurusan ini",
        },
        { status: 403 }
      );
    }

    const program = await prisma.programJurusan.create({
      data: {
        kode_jurusan: body.kode_jurusan,
        judul: body.judul,
        deskripsi: body.deskripsi,
        thumbnail: body.thumbnail || "",
        ...(body.program_id && { program_id: body.program_id }),
      },
      include: {
        jurusan: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data program jurusan berhasil ditambahkan",
      data: program,
    });
  } catch (error) {
    console.error("Error creating program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan data program jurusan" },
      { status: 500 }
    );
  }
}
