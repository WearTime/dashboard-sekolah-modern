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
    const recipient_type = searchParams.get("recipient_type") || "";
    const level = searchParams.get("level") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const lastMonth = searchParams.get("lastMonth") === "true";
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { penyelenggara: { contains: search } },
        { description: { contains: search } },
        { nama_penerima: { contains: search } },
      ];
    }

    if (recipient_type) {
      where.recipient_type = recipient_type;
    }

    if (level) {
      where.level = level;
    }

    if (lastMonth) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      where.tanggal = {
        gte: oneMonthAgo,
      };
    }

    const [prestasi, total] = await Promise.all([
      prisma.prestasi.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tanggal: "desc" },
      }),
      prisma.prestasi.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: prestasi,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching prestasi:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data prestasi" },
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
    const { recipient_type, level } = body;

    let permissionName = "";
    if (recipient_type === "Siswa") {
      const levelLower = level.toLowerCase();
      permissionName = `prestasi.siswa.${levelLower}.create`;
    } else if (recipient_type === "Sekolah") {
      const levelLower = level.toLowerCase();
      permissionName = `prestasi.sekolah.${levelLower}.create`;
    } else if (recipient_type === "GTK") {
      const levelLower = level.toLowerCase();
      permissionName = `prestasi.gtk.${levelLower}.create`;
    }

    const userPermis = await hasPermission(user.id, permissionName);

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk membuat prestasi ini",
        },
        { status: 403 }
      );
    }

    const prestasi = await prisma.prestasi.create({
      data: {
        name: body.name,
        description: body.description,
        penyelenggara: body.penyelenggara,
        recipient_type: body.recipient_type,
        nama_penerima: body.nama_penerima,
        level: body.level,
        tanggal: new Date(body.tanggal),
        image: body.image || "",
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data prestasi berhasil ditambahkan",
      data: prestasi,
    });
  } catch (error) {
    console.error("Error creating prestasi:", error);
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
      { success: false, message: "Gagal menambahkan data prestasi" },
      { status: 500 }
    );
  }
}
