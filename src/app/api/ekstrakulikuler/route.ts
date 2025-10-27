import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { namaEskul: { contains: search } },
        { pendamping: { contains: search } },
        { ketua: { contains: search } },
      ];
    }

    const [ekstrakulikuler, total] = await Promise.all([
      prisma.ekstrakulikuler.findMany({
        where,
        skip,
        take: limit,
        orderBy: { namaEskul: "asc" },
      }),
      prisma.ekstrakulikuler.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: ekstrakulikuler,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching ekstrakulikuler:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data ekstrakulikuler" },
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

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.create");

  if (!userPermis) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  if (user.role !== "PRINCIPAL" && user.role !== "ADMIN") {
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

    const ekstrakulikuler = await prisma.ekstrakulikuler.create({
      data: {
        namaEskul: body.namaEskul,
        pendamping: body.pendamping,
        ketua: body.ketua,
        description: body.description,
        imagesThumbnail: body.imagesThumbnail || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data ekstrakulikuler berhasil ditambahkan",
      data: ekstrakulikuler,
    });
  } catch (error) {
    console.error("Error creating ekstrakulikuler:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan data ekstrakulikuler" },
      { status: 500 }
    );
  }
}
