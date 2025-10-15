import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
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

    if (user.role !== "PRINCIPAL" && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tipe file tidak diizinkan. Hanya JPG, PNG, dan WEBP yang diperbolehkan",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 1MB",
        },
        { status: 400 }
      );
    }

    const fileExtension = path.extname(file.name);
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomName}${fileExtension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "siswa");
    const filePath = path.join(uploadDir, fileName);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const relativePath = `/uploads/siswa/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "File berhasil diupload",
      data: {
        path: relativePath,
        filename: fileName,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "PRINCIPAL" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userPermis = await hasPermission(user.id, "siswa.delete");

    if (!userPermis) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { success: false, message: "Path file tidak ditemukan" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", filePath);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }

    return NextResponse.json({
      success: true,
      message: "File berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus file" },
      { status: 500 }
    );
  }
}
