import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface StatsData {
  siswa: {
    total: number;
    laki: number;
    perempuan: number;
    byKelas: {
      X: { total: number; byJurusan: Record<string, number> };
      XI: { total: number; byJurusan: Record<string, number> };
      XII: { total: number; byJurusan: Record<string, number> };
    };
  };
  guru: {
    total: number;
    laki: number;
    perempuan: number;
  };
  stafftu: {
    total: number;
  };
  mapel: {
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

  return { stats, loading, refetch: fetchStats };
};

export default useDashboardStats;
