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
    const tipe_program = searchParams.get("tipe_program") || "";
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

    if (tipe_program) {
      where.tipe_program = tipe_program;
    }

    const [programs, total] = await Promise.all([
      prisma.programSekolah.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.programSekolah.count({ where }),
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
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data program" },
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
    const { tipe_program } = body;

    let permissionName = "";
    if (tipe_program === "Kurikulum") {
      permissionName = "program.kurikulum.create";
    } else if (tipe_program === "Sarpras") {
      permissionName = "program.sarpras.create";
    } else if (tipe_program === "Siswa") {
      permissionName = "program.siswa.create";
    } else if (tipe_program === "Humas") {
      permissionName = "program.humas.create";
    }

    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk membuat program ini",
        },
        { status: 403 }
      );
    }

    const program = await prisma.programSekolah.create({
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi,
        tipe_program: body.tipe_program,
        thumbnail: body.thumbnail || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data program berhasil ditambahkan",
      data: program,
    });
  } catch (error) {
    console.error("Error creating program:", error);
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
      { success: false, message: "Gagal menambahkan data program" },
      { status: 500 }
    );
  }
}
