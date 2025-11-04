import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      // Data Siswa
      totalSiswa,
      siswaLaki,
      siswaPerempuan,
      siswaByKelasGenderJurusan,

      // Data Guru
      totalGuru,
      guruLaki,
      guruPerempuan,
      guruByStatusGenderGolongan,

      // Data Staff TU
      totalStaff,

      // Data Mapel
      totalMapel,
      mapelUmum,
      mapelJurusan,
      mapelByJurusan,

      // Data Ekstrakulikuler
      totalEkstra,
      ekstraActive,

      // Data Prestasi
      totalPrestasi,
      prestasiSiswa,
      prestasiSekolah,
      prestasiGTK,
      prestasiByLevel,
      prestasiLastMonth,

      // Data Program Sekolah
      totalProgramSekolah,
      programByTipe,

      // Data Program Jurusan
      totalProgramJurusan,
      programJurusanByKode,

      // Data Jurusan
      totalJurusan,
    ] = await Promise.all([
      // Siswa queries
      prisma.dataSiswa.count(),
      prisma.dataSiswa.count({ where: { jenis_kelamin: "L" } }),
      prisma.dataSiswa.count({ where: { jenis_kelamin: "P" } }),
      prisma.dataSiswa.groupBy({
        by: ["kelas", "jurusan", "jenis_kelamin"],
        _count: true,
      }),

      // Guru queries
      prisma.dataGuru.count(),
      prisma.dataGuru.count({ where: { jenis_kelamin: "L" } }),
      prisma.dataGuru.count({ where: { jenis_kelamin: "P" } }),
      prisma.dataGuru.groupBy({
        by: ["status", "golongan", "jenis_kelamin"],
        _count: true,
      }),

      // Staff TU
      prisma.dataTU.count(),

      // Mapel queries
      prisma.mapel.count(),
      prisma.mapel.count({ where: { tipe_mapel: "Umum" } }),
      prisma.mapel.count({ where: { tipe_mapel: "Jurusan" } }),
      prisma.mapel.groupBy({
        by: ["jurusan"],
        where: { tipe_mapel: "Jurusan" },
        _count: true,
      }),

      // Ekstrakulikuler queries
      prisma.ekstrakulikuler.count(),
      prisma.ekstrakulikuler.count({ where: { isActive: true } }),

      // Prestasi queries
      prisma.prestasi.count(),
      prisma.prestasi.count({ where: { recipient_type: "Siswa" } }),
      prisma.prestasi.count({ where: { recipient_type: "Sekolah" } }),
      prisma.prestasi.count({ where: { recipient_type: "GTK" } }),
      prisma.prestasi.groupBy({
        by: ["level"],
        _count: true,
      }),
      prisma.prestasi.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),

      // Program Sekolah queries
      prisma.programSekolah.count(),
      prisma.programSekolah.groupBy({
        by: ["tipe_program"],
        _count: true,
      }),

      // Program Jurusan queries
      prisma.programJurusan.count(),
      prisma.programJurusan.groupBy({
        by: ["kode_jurusan"],
        _count: true,
      }),

      // Jurusan
      prisma.jurusan.count(),
    ]);

    // Process Siswa data by Kelas
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

    // Process Guru data by Status
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

    // Process Mapel by Jurusan
    const byJurusan: Record<string, number> = {};
    mapelByJurusan.forEach((item) => {
      byJurusan[item.jurusan] = item._count;
    });

    // Process Prestasi by Level
    const prestasiLevelData: Record<string, number> = {
      Provinsi: 0,
      Nasional: 0,
      Internasional: 0,
    };
    prestasiByLevel.forEach((item) => {
      prestasiLevelData[item.level] = item._count;
    });

    // Process Program by Tipe
    const programTipeData: Record<string, number> = {
      Kurikulum: 0,
      Sarpras: 0,
      Siswa: 0,
      Humas: 0,
    };
    programByTipe.forEach((item) => {
      programTipeData[item.tipe_program] = item._count;
    });

    // Process Program Jurusan by Kode
    const programJurusanData: Record<string, number> = {};
    programJurusanByKode.forEach((item) => {
      programJurusanData[item.kode_jurusan] = item._count;
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
          total: totalEkstra,
          active: ekstraActive,
          inactive: totalEkstra - ekstraActive,
        },
        prestasi: {
          total: totalPrestasi,
          siswa: prestasiSiswa,
          sekolah: prestasiSekolah,
          gtk: prestasiGTK,
          byLevel: prestasiLevelData,
          lastMonth: prestasiLastMonth,
        },
        program: {
          sekolah: {
            total: totalProgramSekolah,
            byTipe: programTipeData,
          },
          jurusan: {
            total: totalProgramJurusan,
            byJurusan: programJurusanData,
          },
        },
        jurusan: {
          total: totalJurusan,
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
