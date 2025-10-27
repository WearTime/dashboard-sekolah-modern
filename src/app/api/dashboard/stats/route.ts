import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalSiswa,
      siswaLaki,
      siswaPerempuan,
      siswaByKelasGenderJurusan,
      totalGuru,
      guruLaki,
      guruPerempuan,
      guruByStatusGenderGolongan,
      totalStaff,
      totalMapel,
      mapelUmum,
      mapelJurusan,
      mapelByJurusan,
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

      prisma.dataGuru.groupBy({
        by: ["status", "golongan", "jenis_kelamin"],
        _count: true,
      }),
      prisma.dataTU.count(),
      prisma.mapel.count(),
      prisma.mapel.count({ where: { tipe_mapel: "Umum" } }),
      prisma.mapel.count({ where: { tipe_mapel: "Jurusan" } }),
      prisma.mapel.groupBy({
        by: ["jurusan"],
        where: { tipe_mapel: "Jurusan" },
        _count: true,
      }),
    ]);

    const byKelas = {
      X: {
        total: 0,
        laki: 0,
        perempuan: 0,
        byJurusan: {} as Record<string, number>,
        byJurusanGender: {} as Record<
          string,
          { total: number; laki: number; perempuan: number }
        >,
      },
      XI: {
        total: 0,
        laki: 0,
        perempuan: 0,
        byJurusan: {} as Record<string, number>,
        byJurusanGender: {} as Record<
          string,
          { total: number; laki: number; perempuan: number }
        >,
      },
      XII: {
        total: 0,
        laki: 0,
        perempuan: 0,
        byJurusan: {} as Record<string, number>,
        byJurusanGender: {} as Record<
          string,
          { total: number; laki: number; perempuan: number }
        >,
      },
    };

    siswaByKelasGenderJurusan.forEach((item) => {
      const kelas = item.kelas as "X" | "XI" | "XII";
      const gender = item.jenis_kelamin;
      const jurusan = item.jurusan;
      const count = item._count;

      byKelas[kelas].total += count;
      if (gender === "L") {
        byKelas[kelas].laki += count;
      } else {
        byKelas[kelas].perempuan += count;
      }

      if (!byKelas[kelas].byJurusan[jurusan]) {
        byKelas[kelas].byJurusan[jurusan] = 0;
      }
      byKelas[kelas].byJurusan[jurusan] += count;

      if (!byKelas[kelas].byJurusanGender[jurusan]) {
        byKelas[kelas].byJurusanGender[jurusan] = {
          total: 0,
          laki: 0,
          perempuan: 0,
        };
      }
      byKelas[kelas].byJurusanGender[jurusan].total += count;
      if (gender === "L") {
        byKelas[kelas].byJurusanGender[jurusan].laki += count;
      } else {
        byKelas[kelas].byJurusanGender[jurusan].perempuan += count;
      }
    });

    const byStatus = {
      ASN: {
        total: 0,
        laki: 0,
        perempuan: 0,
        byGolongan: {} as Record<string, number>,
        byGolonganGender: {} as Record<
          string,
          { total: number; laki: number; perempuan: number }
        >,
      },
      P3K: {
        total: 0,
        laki: 0,
        perempuan: 0,
        byGolongan: {} as Record<string, number>,
        byGolonganGender: {} as Record<
          string,
          { total: number; laki: number; perempuan: number }
        >,
      },
      Honorer: {
        total: 0,
        laki: 0,
        perempuan: 0,
        byGolongan: {} as Record<string, number>,
        byGolonganGender: {} as Record<
          string,
          { total: number; laki: number; perempuan: number }
        >,
      },
    };

    guruByStatusGenderGolongan.forEach((item) => {
      const status = item.status as "ASN" | "P3K" | "Honorer";
      const gender = item.jenis_kelamin;
      const golongan = item.golongan;
      const count = item._count;

      byStatus[status].total += count;
      if (gender === "L") {
        byStatus[status].laki += count;
      } else {
        byStatus[status].perempuan += count;
      }

      if (golongan) {
        if (!byStatus[status].byGolongan[golongan]) {
          byStatus[status].byGolongan[golongan] = 0;
        }
        byStatus[status].byGolongan[golongan] += count;

        if (!byStatus[status].byGolonganGender[golongan]) {
          byStatus[status].byGolonganGender[golongan] = {
            total: 0,
            laki: 0,
            perempuan: 0,
          };
        }
        byStatus[status].byGolonganGender[golongan].total += count;
        if (gender === "L") {
          byStatus[status].byGolonganGender[golongan].laki += count;
        } else {
          byStatus[status].byGolonganGender[golongan].perempuan += count;
        }
      }
    });

    const byJurusan: Record<string, number> = {};
    mapelByJurusan.forEach((item) => {
      byJurusan[item.jurusan] = item._count;
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
          byStatus,
        },
        stafftu: {
          total: totalStaff,
        },
        mapel: {
          total: totalMapel,
          umum: mapelUmum,
          jurusan: mapelJurusan,
          byJurusan,
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
