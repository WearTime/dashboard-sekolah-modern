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
  golongan: ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"],
  mapel: ["#0ea5e9", "#06b6d4", "#14b8a6", "#10b981"],
};

interface Stats {
  siswa: {
    total: number;
    laki: number;
    perempuan: number;
    byKelas: {
      [key: string]: {
        total: number;
        laki: number;
        perempuan: number;
        byJurusan: { [key: string]: number };
        byJurusanGender: {
          [key: string]: { total: number; laki: number; perempuan: number };
        };
      };
    };
  };
  guru: {
    total: number;
    laki: number;
    perempuan: number;
    byStatus: {
      [key: string]: {
        total: number;
        laki: number;
        perempuan: number;
        byGolongan: { [key: string]: number };
        byGolonganGender: {
          [key: string]: { total: number; laki: number; perempuan: number };
        };
      };
    };
  };
  stafftu: {
    total: number;
  };
  mapel: {
    total: number;
    umum: number;
    jurusan: number;
    byJurusan: { [key: string]: number };
  };
  ekstra: {
    total: number;
  };
}

const DashboardCharts = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

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
  Object.values(stats.siswa.byKelas).forEach((kelas) => {
    Object.entries(kelas.byJurusan).forEach(([jurusan, count]) => {
      jurusanMap.set(jurusan, (jurusanMap.get(jurusan) || 0) + count);
    });
  });

  const jurusanData = Array.from(jurusanMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const golonganMap = new Map<string, number>();
  Object.values(stats.guru.byStatus).forEach((status) => {
    Object.entries(status.byGolongan).forEach(([golongan, count]) => {
      golonganMap.set(golongan, (golonganMap.get(golongan) || 0) + count);
    });
  });

  const golonganData = Array.from(golonganMap.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const kelasGenderData = [
    {
      kelas: "X",
      Laki: stats.siswa.byKelas.X.laki,
      Perempuan: stats.siswa.byKelas.X.perempuan,
    },
    {
      kelas: "XI",
      Laki: stats.siswa.byKelas.XI.laki,
      Perempuan: stats.siswa.byKelas.XI.perempuan,
    },
    {
      kelas: "XII",
      Laki: stats.siswa.byKelas.XII.laki,
      Perempuan: stats.siswa.byKelas.XII.perempuan,
    },
  ];

  const statusGenderData = [
    {
      status: "ASN",
      Laki: stats.guru.byStatus.ASN.laki,
      Perempuan: stats.guru.byStatus.ASN.perempuan,
    },
    {
      status: "P3K",
      Laki: stats.guru.byStatus.P3K.laki,
      Perempuan: stats.guru.byStatus.P3K.perempuan,
    },
    {
      status: "Honorer",
      Laki: stats.guru.byStatus.Honorer.laki,
      Perempuan: stats.guru.byStatus.Honorer.perempuan,
    },
  ];

  const mapelData = [
    { name: "Mapel Umum", value: stats.mapel.umum },
    { name: "Mapel Jurusan", value: stats.mapel.jurusan },
  ];

  const mapelJurusanData = Object.entries(stats.mapel.byJurusan).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const overviewData = [
    {
      category: "Siswa",
      total: stats.siswa.total,
    },
    {
      category: "Guru",
      total: stats.guru.total,
    },
    {
      category: "Staff TU",
      total: stats.stafftu.total,
    },
    {
      category: "Mapel",
      total: stats.mapel.total,
    },
    {
      category: "Ekskul",
      total: stats.ekstra.total,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jurusanDetailData: any[] = [];
  jurusanMap.forEach((_, jurusanName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = { jurusan: jurusanName };
    Object.entries(stats.siswa.byKelas).forEach(([kelasName, kelasData]) => {
      data[kelasName] = kelasData.byJurusan[jurusanName] || 0;
    });
    jurusanDetailData.push(data);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (entry: any) => {
    return `${entry.value}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPercentageLabel = (entry: any) => {
    const total = entry.percent * 100;
    return `${total.toFixed(0)}%`;
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
      ></h3>

      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Perbandingan Data Sekolah
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#26a7b8" name="Total">
                  {overviewData.map((entry, index) => (
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

      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Siswa Berdasarkan Gender
            </h5>
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
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Siswa Per Kelas
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={kelasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" name="Jumlah Siswa">
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
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Distribusi Gender Per Kelas
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={kelasGenderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kelas" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Laki" fill="#3b82f6" />
                <Bar dataKey="Perempuan" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Siswa Per Jurusan
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jurusanData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
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

          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Detail Jurusan Per Kelas
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jurusanDetailData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jurusan" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="X" fill="#8b5cf6" name="Kelas X" />
                <Bar dataKey="XI" fill="#06b6d4" name="Kelas XI" />
                <Bar dataKey="XII" fill="#f97316" name="Kelas XII" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Guru Berdasarkan Gender
            </h5>
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
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Guru Berdasarkan Status
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusGuruData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPercentageLabel}
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

          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Distribusi Gender Per Status
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusGenderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Laki" fill="#3b82f6" />
                <Bar dataKey="Perempuan" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {golonganData.length > 0 && (
            <div>
              <h5
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  textAlign: "center",
                  color: "#374151",
                }}
              >
                Guru Berdasarkan Golongan
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={golonganData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" name="Jumlah Guru">
                    {golonganData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS.golongan[index % COLORS.golongan.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#374151",
              }}
            >
              Distribusi Tipe Mapel
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mapelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mapelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.mapel[index % COLORS.mapel.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {mapelJurusanData.length > 0 && (
            <div>
              <h5
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  textAlign: "center",
                  color: "#374151",
                }}
              >
                Mapel Jurusan Per Program
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mapelJurusanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#14b8a6" name="Jumlah Mapel">
                    {mapelJurusanData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS.jurusan[index % COLORS.jurusan.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
