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

// src/app/api/program-jurusan/[id]/route.ts

export async function GET_BY_ID(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const program = await prisma.programJurusan.findUnique({
      where: { id },
      include: {
        jurusan: true,
      },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Data program jurusan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error("Error fetching program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data program jurusan" },
      { status: 500 }
    );
  }
}

export async function PUT_BY_ID(
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
    const { kode_jurusan } = body;

    const permissionName = `program.jurusan.${kode_jurusan}.edit`;
    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk mengedit program jurusan ini",
        },
        { status: 403 }
      );
    }

    const program = await prisma.programJurusan.update({
      where: { id },
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi,
        thumbnail: body.thumbnail || "",
      },
      include: {
        jurusan: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data program jurusan berhasil diperbarui",
      data: program,
    });
  } catch (error) {
    console.error("Error updating program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data program jurusan" },
      { status: 500 }
    );
  }
}

export async function DELETE_BY_ID(
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
    const program = await prisma.programJurusan.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Data program jurusan tidak ditemukan" },
        { status: 404 }
      );
    }

    const permissionName = `program.jurusan.${program.kode_jurusan}.delete`;
    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk menghapus program jurusan ini",
        },
        { status: 403 }
      );
    }

    await prisma.programJurusan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data program jurusan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting program jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data program jurusan" },
      { status: 500 }
    );
  }
}
