import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DrillState } from "WT/types/drilldown";

interface KelasData {
  total: number;
  laki: number;
  perempuan: number;
  byJurusan: Record<string, number>;
  byJurusanGender: Record<
    string,
    { total: number; laki: number; perempuan: number }
  >;
}

interface StatusData {
  total: number;
  laki: number;
  perempuan: number;
  byGolongan: Record<string, number>;
  byGolonganGender: Record<
    string,
    { total: number; laki: number; perempuan: number }
  >;
}

interface StatsData {
  siswa: {
    total: number;
    laki: number;
    perempuan: number;
    byKelas: {
      X: KelasData;
      XI: KelasData;
      XII: KelasData;
    };
  };
  guru: {
    total: number;
    laki: number;
    perempuan: number;
    byStatus: {
      ASN: StatusData;
      P3K: StatusData;
      Honorer: StatusData;
    };
  };
  stafftu: {
    total: number;
  };
  mapel: {
    umum: string | number;
    jurusan: string | number;
    byJurusan: Record<string, number>;
    total: number;
  };
  ekstra: {
    total: number;
  };
}

const useDashboardStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        toast.error("Failed to fetch dashboard statistics");
      }
    } catch (error) {
      toast.error("Error loading dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan stats yang sudah difilter berdasarkan drillState
  const getFilteredStats = (drillState: DrillState): StatsData | null => {
    if (!stats) return null;

    const filtered = JSON.parse(JSON.stringify(stats)) as StatsData;

    // Filter untuk SISWA
    if (drillState.entityType === "siswa") {
      // Jika ada filter gender di level kelas
      if (drillState.level === "kelas" && drillState.filters.gender) {
        const gender = drillState.filters.gender;

        // Filter byKelas berdasarkan gender
        Object.keys(filtered.siswa.byKelas).forEach((kelas) => {
          const kelasKey = kelas as "X" | "XI" | "XII";
          const originalKelas = stats.siswa.byKelas[kelasKey];

          // Set total sesuai gender
          filtered.siswa.byKelas[kelasKey].total =
            gender === "L" ? originalKelas.laki : originalKelas.perempuan;

          // Filter jurusan berdasarkan gender
          Object.keys(originalKelas.byJurusanGender).forEach((jurusan) => {
            const jurusanData = originalKelas.byJurusanGender[jurusan];
            filtered.siswa.byKelas[kelasKey].byJurusan[jurusan] =
              gender === "L" ? jurusanData.laki : jurusanData.perempuan;
          });
        });
      }

      // Jika ada filter gender dan kelas di level jurusan
      if (drillState.level === "jurusan" && drillState.filters.kelas) {
        const kelas = drillState.filters.kelas as "X" | "XI" | "XII";
        const gender = drillState.filters.gender;

        if (gender) {
          const originalJurusanGender =
            stats.siswa.byKelas[kelas].byJurusanGender;

          Object.keys(originalJurusanGender).forEach((jurusan) => {
            const jurusanData = originalJurusanGender[jurusan];
            filtered.siswa.byKelas[kelas].byJurusan[jurusan] =
              gender === "L" ? jurusanData.laki : jurusanData.perempuan;
          });
        }
      }
    }

    // Filter untuk GURU
    if (drillState.entityType === "guru") {
      // Jika ada filter gender di level status
      if (drillState.level === "status" && drillState.filters.gender) {
        const gender = drillState.filters.gender;

        Object.keys(filtered.guru.byStatus).forEach((status) => {
          const statusKey = status as "ASN" | "P3K" | "Honorer";
          const originalStatus = stats.guru.byStatus[statusKey];

          // Set total sesuai gender
          filtered.guru.byStatus[statusKey].total =
            gender === "L" ? originalStatus.laki : originalStatus.perempuan;

          // Filter golongan berdasarkan gender
          Object.keys(originalStatus.byGolonganGender).forEach((golongan) => {
            const golonganData = originalStatus.byGolonganGender[golongan];
            filtered.guru.byStatus[statusKey].byGolongan[golongan] =
              gender === "L" ? golonganData.laki : golonganData.perempuan;
          });
        });
      }

      // Jika ada filter gender dan status di level golongan
      if (drillState.level === "golongan" && drillState.filters.status) {
        const status = drillState.filters.status as "ASN" | "P3K" | "Honorer";
        const gender = drillState.filters.gender;

        if (gender) {
          const originalGolonganGender =
            stats.guru.byStatus[status].byGolonganGender;

          Object.keys(originalGolonganGender).forEach((golongan) => {
            const golonganData = originalGolonganGender[golongan];
            filtered.guru.byStatus[status].byGolongan[golongan] =
              gender === "L" ? golonganData.laki : golonganData.perempuan;
          });
        }
      }
    }

    return filtered;
  };

  return { stats, loading, refetch: fetchStats, getFilteredStats };
};

export default useDashboardStats;
