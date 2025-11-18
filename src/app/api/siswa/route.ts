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
    const kelas = searchParams.get("kelas") || "";
    const jurusan = searchParams.get("jurusan") || "";
    const gender = searchParams.get("jenis_kelamin") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nisn: { contains: search } },
      ];
    }

    if (kelas) {
      where.kelas = kelas;
    }

    if (gender) {
      where.jenis_kelamin = gender;
    }

    if (jurusan) {
      where.jurusan = jurusan;
    }

    const [siswa, total] = await Promise.all([
      prisma.dataSiswa.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nama: "asc" },
      }),
      prisma.dataSiswa.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: siswa,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching siswa:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data siswa" },
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
  const userPermis = await hasPermission(user.id, "siswa.create");

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

    const existingSiswa = await prisma.dataSiswa.findUnique({
      where: { nisn: body.nisn },
    });

    if (existingSiswa) {
      return NextResponse.json(
        { success: false, message: "NISN sudah terdaftar" },
        { status: 400 }
      );
    }

    const siswa = await prisma.dataSiswa.create({
      data: {
        nisn: body.nisn,
        nama: body.nama,
        kelas: body.kelas,
        jurusan: body.jurusan,
        no_hp: body.no_hp || null,
        jenis_kelamin: body.jenis_kelamin,
        tempat_lahir: body.tempat_lahir || null,
        tanggal_lahir: new Date(body.tanggal_lahir),
        alamat: body.alamat || null,
        image: body.image || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil ditambahkan",
      data: siswa,
    });
  } catch (error) {
    console.error("Error creating siswa:", error);
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
      { success: false, message: "Gagal menambahkan data siswa" },
      { status: 500 }
    );
  }
}
