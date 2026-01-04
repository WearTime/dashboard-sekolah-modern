import { NextRequest, NextResponse } from "next/server";
import { prisma } from "WT/lib/prisma";
import { ExcelParser } from "WT/lib/excel-parser";
import { importConfigs, ImportEntityType } from "WT/config/import.config";
import { requireAuth } from "WT/lib/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ entity: string }> }
) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { entity } = await context.params;

    if (!importConfigs[entity as ImportEntityType]) {
      return NextResponse.json(
        {
          success: false,
          message: `Entity type "${entity}" tidak didukung`,
        },
        { status: 400 }
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

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        {
          success: false,
          message: "File harus berformat Excel (.xlsx atau .xls)",
        },
        { status: 400 }
      );
    }

    const config = importConfigs[entity as ImportEntityType];
    const parser = new ExcelParser(config);
    const parseResult = await parser.parseFile(file);

    if (!parseResult.success || !parseResult.data) {
      return NextResponse.json({
        success: false,
        message: "Gagal memproses file Excel",
        result: parseResult,
      });
    }

    const importResult = await importToDatabase(
      entity as ImportEntityType,
      parseResult.data
    );

    return NextResponse.json({
      success: true,
      message: `Berhasil import ${importResult.successCount} dari ${parseResult.totalRows} data`,
      result: {
        ...parseResult,
        successCount: importResult.successCount,
        failedCount: importResult.failedCount,
        errors: [...parseResult.errors, ...importResult.errors],
      },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat import data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function importToDatabase(
  entity: ImportEntityType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
): Promise<{
  successCount: number;
  failedCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any[] = [];
  let successCount = 0;
  let failedCount = 0;

  switch (entity) {
    case "siswa":
      for (const item of data) {
        try {
          await prisma.dataSiswa.upsert({
            where: { nisn: item.nisn },
            update: {
              nama: item.nama,
              kelas: item.kelas,
              jurusan: item.jurusan,
              jenis_kelamin: item.jenis_kelamin,
              tempat_lahir: item.tempat_lahir,
              tanggal_lahir: new Date(item.tanggal_lahir),
              no_hp: item.no_hp,
              alamat: item.alamat,
            },
            create: {
              nisn: item.nisn,
              nama: item.nama,
              kelas: item.kelas,
              jurusan: item.jurusan,
              jenis_kelamin: item.jenis_kelamin,
              tempat_lahir: item.tempat_lahir,
              tanggal_lahir: new Date(item.tanggal_lahir),
              no_hp: item.no_hp,
              alamat: item.alamat,
            },
          });
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push({
            nisn: item.nisn,
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      break;

    case "guru":
      for (const item of data) {
        try {
          await prisma.dataGuru.upsert({
            where: { nip: item.nip },
            update: {
              nama: item.nama,
              jenis_kelamin: item.jenis_kelamin,
              status: item.status,
              golongan: item.golongan || null,
              no_hp: item.no_hp,
              alamat: item.alamat,
            },
            create: {
              nip: item.nip,
              nama: item.nama,
              jenis_kelamin: item.jenis_kelamin,
              status: item.status,
              golongan: item.golongan || null,
              no_hp: item.no_hp,
              alamat: item.alamat,
            },
          });
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push({
            nip: item.nip,
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      break;

    case "prestasi":
      for (const item of data) {
        try {
          await prisma.prestasi.create({
            data: {
              name: item.name,
              description: item.description,
              penyelenggara: item.penyelenggara,
              recipient_type: item.recipient_type,
              nama_penerima: item.nama_penerima,
              level: item.level,
              tanggal: new Date(item.tanggal),
              image: "",
              createdAt: new Date(),
            },
          });
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push({
            name: item.name,
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      break;

    default:
      throw new Error(`Import untuk entity "${entity}" belum diimplementasi`);
  }

  return { successCount, failedCount, errors };
}
