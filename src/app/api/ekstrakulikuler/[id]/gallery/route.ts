import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";
import { gallerySchema } from "WT/validators/eskul.validator";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const galleries = await prisma.ekstrakulikulerGallery.findMany({
      where: { ekstrakulikulerId: id },
      orderBy: { order: "asc" },
    });

    const serializedGalleries = galleries.map((gallery) => ({
      ...gallery,
      createdAt: gallery.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedGalleries,
    });
  } catch (error) {
    console.error("Error fetching ekstrakulikuler gallery:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data galeri" },
      { status: 500 }
    );
  }
}

export async function POST(
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

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.edit");

  if (!userPermis) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const eskul = await prisma.ekstrakulikuler.findUnique({
      where: { id },
    });

    if (!eskul) {
      return NextResponse.json(
        { success: false, message: "Ekstrakulikuler tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validatedData = gallerySchema.parse(body);

    const gallery = await prisma.ekstrakulikulerGallery.create({
      data: {
        ekstrakulikulerId: id,
        imagePath: validatedData.imagePath,
        caption: validatedData.caption,
        order: validatedData.order,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Foto galeri berhasil ditambahkan",
      data: gallery,
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
      { success: false, message: "Gagal menambahkan foto galeri" },
      { status: 500 }
    );
  }
}
