"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  primary: ["#3b82f6", "#ec4899"],
  status: ["#10b981", "#f59e0b", "#ef4444"],
  kelas: ["#8b5cf6", "#06b6d4", "#f97316"],
  jurusan: ["#14b8a6", "#f43f5e", "#84cc16", "#a855f7", "#eab308"],
};

const DashboardCharts = () => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.125rem", color: "#6b7280" }}>
          Loading charts...
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const siswaGenderData = [
    { name: "Laki-laki", value: stats.siswa.laki },
    { name: "Perempuan", value: stats.siswa.perempuan },
  ];

  const guruGenderData = [
    { name: "Laki-laki", value: stats.guru.laki },
    { name: "Perempuan", value: stats.guru.perempuan },
  ];

  const kelasData = [
    { name: "Kelas X", value: stats.siswa.byKelas.X.total },
    { name: "Kelas XI", value: stats.siswa.byKelas.XI.total },
    { name: "Kelas XII", value: stats.siswa.byKelas.XII.total },
  ];

  const statusGuruData = [
    { name: "ASN", value: stats.guru.byStatus.ASN.total },
    { name: "P3K", value: stats.guru.byStatus.P3K.total },
    { name: "Honorer", value: stats.guru.byStatus.Honorer.total },
  ];

  const jurusanMap = new Map<string, number>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(stats.siswa.byKelas).forEach((kelas: any) => {
    Object.entries(kelas.byJurusan).forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([jurusan, count]: [string, any]) => {
        jurusanMap.set(jurusan, (jurusanMap.get(jurusan) || 0) + count);
      }
    );
  });

  const jurusanData = Array.from(jurusanMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (entry: any) => {
    return `${entry.value}`;
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        marginBottom: "2rem",
      }}
    >
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "1.5rem",
          color: "#1f2937",
        }}
      >
        Statistik Data Sekolah
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#374151",
            }}
          >
            Data Siswa Berdasarkan Gender
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={siswaGenderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {siswaGenderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.primary[index % COLORS.primary.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#374151",
            }}
          >
            Data Guru Berdasarkan Gender
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={guruGenderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {guruGenderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.primary[index % COLORS.primary.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#374151",
            }}
          >
            Data Siswa Per Kelas
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={kelasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6">
                {kelasData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.kelas[index % COLORS.kelas.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#374151",
            }}
          >
            Data Guru Berdasarkan Status
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusGuruData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusGuruData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.status[index % COLORS.status.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#374151",
            }}
          >
            Data Siswa Per Jurusan
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={jurusanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#14b8a6" name="Jumlah Siswa">
                {jurusanData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.jurusan[index % COLORS.jurusan.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
