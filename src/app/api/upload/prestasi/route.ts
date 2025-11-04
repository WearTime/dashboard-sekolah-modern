import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getCurrentUser } from "WT/lib/auth";
import { hasAnyPermission } from "WT/lib/permissions";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_FILE_SIZE = 1000; // 1000 bytes (1KB)

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasCreatePermission = await hasAnyPermission(user.id, [
      "prestasi.siswa.provinsi.create",
      "prestasi.siswa.nasional.create",
      "prestasi.siswa.internasional.create",
      "prestasi.sekolah.provinsi.create",
      "prestasi.sekolah.nasional.create",
      "prestasi.sekolah.internasional.create",
      "prestasi.gtk.provinsi.create",
      "prestasi.gtk.nasional.create",
      "prestasi.gtk.internasional.create",
    ]);

    if (!hasCreatePermission) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden - Anda tidak memiliki permission untuk upload",
        },
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

    if (file.size < MIN_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran file terlalu kecil. Minimal 1KB" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran file terlalu besar. Maksimal 5MB" },
        { status: 400 }
      );
    }

    const fileExtension = path.extname(file.name);
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomName}${fileExtension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "prestasi");
    const filePath = path.join(uploadDir, fileName);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const relativePath = `/uploads/prestasi/${fileName}`;

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
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasDeletePermission = await hasAnyPermission(user.id, [
      "prestasi.siswa.provinsi.delete",
      "prestasi.siswa.nasional.delete",
      "prestasi.siswa.internasional.delete",
      "prestasi.sekolah.provinsi.delete",
      "prestasi.sekolah.nasional.delete",
      "prestasi.sekolah.internasional.delete",
      "prestasi.gtk.provinsi.delete",
      "prestasi.gtk.nasional.delete",
      "prestasi.gtk.internasional.delete",
    ]);

    if (!hasDeletePermission) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - Anda tidak memiliki permission untuk menghapus file",
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
