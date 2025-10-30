import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1000");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nama_lengkap: { contains: search } },
        { kode: { contains: search } },
      ];
    }

    const [jurusan, total] = await Promise.all([
      prisma.jurusan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nama: "asc" },
      }),
      prisma.jurusan.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: jurusan,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching jurusan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data jurusan" },
      { status: 500 }
    );
  }
}
