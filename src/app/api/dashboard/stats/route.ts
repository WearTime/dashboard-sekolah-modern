import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalSiswa,
      siswaLaki,
      siswaPerempuan,
      siswaByKelas,
      totalGuru,
      guruLaki,
      guruPerempuan,
      totalStaff,
      totalMapel,
    ] = await Promise.all([
      prisma.dataSiswa.count(),
      prisma.dataSiswa.count({ where: { jenis_kelamin: "L" } }),
      prisma.dataSiswa.count({ where: { jenis_kelamin: "P" } }),
      prisma.dataSiswa.groupBy({
        by: ["kelas", "jurusan", "jenis_kelamin"],
        _count: true,
      }),
      prisma.dataGuru.count(),
      prisma.dataGuru.count({ where: { jenis_kelamin: "L" } }),
      prisma.dataGuru.count({ where: { jenis_kelamin: "P" } }),
      prisma.dataTU.count(),
      prisma.mapel.count(),
    ]);

    const byKelas = {
      X: { total: 0, byJurusan: {} as Record<string, number> },
      XI: { total: 0, byJurusan: {} as Record<string, number> },
      XII: { total: 0, byJurusan: {} as Record<string, number> },
    };

    siswaByKelas.forEach((item) => {
      const kelas = item.kelas as "X" | "XI" | "XII";
      byKelas[kelas].total += item._count;

      if (!byKelas[kelas].byJurusan[item.jurusan]) {
        byKelas[kelas].byJurusan[item.jurusan] = 0;
      }
      byKelas[kelas].byJurusan[item.jurusan] += item._count;
    });

    return NextResponse.json({
      success: true,
      data: {
        siswa: {
          total: totalSiswa,
          laki: siswaLaki,
          perempuan: siswaPerempuan,
          byKelas,
        },
        guru: {
          total: totalGuru,
          laki: guruLaki,
          perempuan: guruPerempuan,
        },
        stafftu: {
          total: totalStaff,
        },
        mapel: {
          total: totalMapel,
        },
        ekstra: {
          total: 10,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
