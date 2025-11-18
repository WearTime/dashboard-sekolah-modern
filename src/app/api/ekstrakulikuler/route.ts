import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";
import { ekstrakulikulerSchema } from "WT/validators/eskul.validator";
import { ZodError } from "zod";

const prisma = new PrismaClient();

function generateSlug(namaEskul: string): string {
  return namaEskul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const includeGallery = searchParams.get("includeGallery") === "true";
    const activeOnly = searchParams.get("activeOnly") === "true";
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (activeOnly) {
      where.isActive = true;
    }

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
        orderBy: [{ order: "asc" }, { namaEskul: "asc" }],
        include: includeGallery
          ? {
              galleries: {
                orderBy: { order: "asc" },
              },
            }
          : undefined,
      }),
      prisma.ekstrakulikuler.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serializedData = ekstrakulikuler.map((eskul: any) => {
      const baseData = {
        ...eskul,
        createdAt: eskul.createdAt.toISOString(),
        updatedAt: eskul.updatedAt.toISOString(),
      };

      if (eskul.galleries && Array.isArray(eskul.galleries)) {
        return {
          ...baseData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          galleries: eskul.galleries.map((g: any) => ({
            ...g,
            createdAt: g.createdAt.toISOString(),
          })),
        };
      }

      return baseData;
    });

    return NextResponse.json({
      success: true,
      data: serializedData,
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
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.create");

  if (!userPermis) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const slug = body.slug || generateSlug(body.namaEskul);

    const existingSlug = await prisma.ekstrakulikuler.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: `Slug "${slug}" sudah digunakan. Gunakan nama yang berbeda.`,
        },
        { status: 400 }
      );
    }

    const validatedData = ekstrakulikulerSchema.parse({
      ...body,
      slug,
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    const ekstrakulikuler = await prisma.ekstrakulikuler.create({
      data: {
        namaEskul: validatedData.namaEskul,
        pendamping: validatedData.pendamping,
        ketua: validatedData.ketua,
        description: validatedData.description,
        imagesThumbnail: validatedData.imagesThumbnail || "",
        slug: validatedData.slug,
        order: validatedData.order,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data ekstrakulikuler berhasil ditambahkan",
      data: ekstrakulikuler,
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
      { success: false, message: "Gagal menambahkan data ekstrakulikuler" },
      { status: 500 }
    );
  }
}
