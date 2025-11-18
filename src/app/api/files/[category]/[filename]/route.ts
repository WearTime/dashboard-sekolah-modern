import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const ALLOWED_CATEGORIES = [
  "siswa",
  "guru",
  "prestasi",
  "ekstrakulikuler",
  "program",
  "program-jurusan",
  "kegiatan",
];

const CATEGORY_PATHS: Record<string, string> = {
  "ekstrakulikuler-gallery": "ekstrakulikuler/gallery",
};

interface RouteParams {
  params: Promise<{
    category: string;
    filename: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { category, filename } = await params;

    if (!ALLOWED_CATEGORIES.includes(category) && !CATEGORY_PATHS[category]) {
      return new NextResponse("Invalid category", { status: 400 });
    }

    if (!filename || filename.includes("..") || filename.includes("/")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const categoryPath = CATEGORY_PATHS[category] || category;
    const filePath = path.join(
      process.cwd(),
      "uploads",
      categoryPath,
      filename
    );

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

    const ext = path.extname(filename).toLowerCase();
    const contentType =
      {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      }[ext] || "application/octet-stream";

    const arrayBuffer = bufferToArrayBuffer(fileBuffer);

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; i++) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}
