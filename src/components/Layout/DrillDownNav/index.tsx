"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrillState, StatCardData } from "WT/types/drilldown";
import useDashboardStats from "WT/hooks/useDrillDown";
import styles from "./DrillDownNav.module.css";
import Button from "WT/components/Ui/Button";

const DrillDownNav = () => {
  const router = useRouter();
  const { stats, loading, getFilteredStats } = useDashboardStats();
  const [drillState, setDrillState] = useState<DrillState>({
    level: "main",
    filters: {},
    entityType: null,
  });

  // Gunakan stats yang sudah difilter
  const filteredStats = getFilteredStats(drillState);

  const handleDrillDown = (
    entityType: "siswa" | "guru" | "stafftu" | "mapel",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: any
  ) => {
    setDrillState({
      level: filters
        ? drillState.level
        : entityType === "mapel"
        ? "tipe"
        : "gender",
      filters: { ...drillState.filters, ...filters },
      entityType,
    });
  };

  const handleBack = () => {
    // Siswa: main > gender > kelas > jurusan
    // Guru: main > gender > status > golongan
    // Mapel: main > tipe > jurusan (untuk Jurusan) atau langsung list (untuk Umum)
    const siswaLevels: DrillState["level"][] = [
      "main",
      "gender",
      "kelas",
      "jurusan",
    ];
    const guruLevels: DrillState["level"][] = [
      "main",
      "gender",
      "status",
      "golongan",
    ];
    const mapelLevels: DrillState["level"][] = ["main", "tipe", "jurusan"];

    let levels: DrillState["level"][] = [];

    if (drillState.entityType === "siswa") {
      levels = siswaLevels;
    } else if (drillState.entityType === "guru") {
      levels = guruLevels;
    } else if (drillState.entityType === "mapel") {
      levels = mapelLevels;
    }

    const currentIndex = levels.indexOf(drillState.level);

    if (currentIndex > 0) {
      const newLevel = levels[currentIndex - 1];
      const newFilters = { ...drillState.filters };

      if (newLevel === "main") {
        setDrillState({ level: "main", filters: {}, entityType: null });
      } else if (newLevel === "gender") {
        delete newFilters.kelas;
        delete newFilters.jurusan;
        delete newFilters.status;
        delete newFilters.golongan;
        setDrillState({ ...drillState, level: newLevel, filters: newFilters });
      } else if (newLevel === "kelas") {
        delete newFilters.jurusan;
        setDrillState({ ...drillState, level: newLevel, filters: newFilters });
      } else if (newLevel === "status") {
        delete newFilters.golongan;
        setDrillState({ ...drillState, level: newLevel, filters: newFilters });
      } else if (newLevel === "tipe") {
        delete newFilters.jurusan;
        setDrillState({ ...drillState, level: newLevel, filters: newFilters });
      }
    }
  };

  const navigateToList = () => {
    const params = new URLSearchParams();

    // For Siswa
    if (drillState.entityType === "siswa") {
      if (drillState.filters.gender) {
        params.append("jenis_kelamin", drillState.filters.gender);
      }
      if (drillState.filters.kelas) {
        params.append("kelas", drillState.filters.kelas);
      }
      if (drillState.filters.jurusan) {
        params.append("jurusan", drillState.filters.jurusan);
      }
      router.push(`/siswa?${params.toString()}`);
    }

    // For Guru
    if (drillState.entityType === "guru") {
      if (drillState.filters.gender) {
        params.append("jenis_kelamin", drillState.filters.gender);
      }
      if (drillState.filters.status) {
        params.append("status", drillState.filters.status);
      }
      if (drillState.filters.golongan) {
        params.append("golongan", drillState.filters.golongan);
      }

      const queryString = params.toString();
      console.log("Navigating to guru with params:", queryString);
      router.push(`/guru?${queryString}`);
    }

    // For Mapel
    if (drillState.entityType === "mapel") {
      if (drillState.filters.tipe) {
        params.append("tipe_mapel", drillState.filters.tipe);
      }
      if (drillState.filters.jurusan) {
        params.append("jurusan", drillState.filters.jurusan);
      }

      const queryString = params.toString();
      console.log("Navigating to mapel with params:", queryString);
      router.push(`/mapel?${queryString}`);
    }
  };

  const getCards = (): StatCardData[] => {
    if (!filteredStats) return [];

    if (drillState.level === "main") {
      return [
        {
          icon: "fas fa-user-graduate",
          title: "Total Siswa",
          value: filteredStats.siswa.total,
          action: () => handleDrillDown("siswa"),
        },
        {
          icon: "fas fa-chalkboard-teacher",
          title: "Total Guru",
          value: filteredStats.guru.total,
          action: () => handleDrillDown("guru"),
        },
        {
          icon: "fas fa-book-open",
          title: "Total Mapel",
          value: filteredStats.mapel.total,
          action: () => handleDrillDown("mapel"),
        },
        {
          icon: "fas fa-users",
          title: "Total Ekstrakulikuler",
          value: filteredStats.ekstra.total,
        },
        {
          icon: "fas fa-sitemap",
          title: "Struktur Organisasi",
          value: "-",
        },
        {
          icon: "fas fa-user-tie",
          title: "Total Staff TU",
          value: filteredStats.stafftu.total,
          action: () => handleDrillDown("stafftu"),
        },
      ];
    }

    // ===== SISWA DRILL DOWN =====
    if (drillState.entityType === "siswa" && drillState.level === "gender") {
      return [
        {
          icon: "fas fa-mars",
          title: "Siswa Laki-laki",
          value: filteredStats.siswa.laki,
          action: () => {
            setDrillState({
              ...drillState,
              level: "kelas",
              filters: { ...drillState.filters, gender: "L" },
            });
          },
        },
        {
          icon: "fas fa-venus",
          title: "Siswa Perempuan",
          value: filteredStats.siswa.perempuan,
          action: () => {
            setDrillState({
              ...drillState,
              level: "kelas",
              filters: { ...drillState.filters, gender: "P" },
            });
          },
        },
        {
          icon: "fas fa-users",
          title: "Semua Siswa",
          value: filteredStats.siswa.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "kelas",
              filters: { ...drillState.filters },
            });
          },
        },
      ];
    }

    if (drillState.entityType === "siswa" && drillState.level === "kelas") {
      return [
        {
          icon: "fas fa-graduation-cap",
          title: "Kelas X",
          value: filteredStats.siswa.byKelas.X.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "jurusan",
              filters: { ...drillState.filters, kelas: "X" },
            });
          },
        },
        {
          icon: "fas fa-graduation-cap",
          title: "Kelas XI",
          value: filteredStats.siswa.byKelas.XI.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "jurusan",
              filters: { ...drillState.filters, kelas: "XI" },
            });
          },
        },
        {
          icon: "fas fa-graduation-cap",
          title: "Kelas XII",
          value: filteredStats.siswa.byKelas.XII.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "jurusan",
              filters: { ...drillState.filters, kelas: "XII" },
            });
          },
        },
      ];
    }

    if (drillState.entityType === "siswa" && drillState.level === "jurusan") {
      const kelas = drillState.filters.kelas as "X" | "XI" | "XII";
      const jurusanData = filteredStats.siswa.byKelas[kelas].byJurusan;

      return Object.entries(jurusanData).map(([jurusan, count]) => ({
        icon: "fas fa-book",
        title: jurusan,
        value: count,
        action: () => {
          const newFilters = { ...drillState.filters, jurusan };
          console.log("Setting siswa jurusan filter:", newFilters);
          setDrillState({
            ...drillState,
            filters: newFilters,
          });

          // Navigate dengan filters yang baru
          const params = new URLSearchParams();
          if (newFilters.gender) {
            params.append("jenis_kelamin", newFilters.gender);
          }
          if (newFilters.kelas) {
            params.append("kelas", newFilters.kelas);
          }
          if (jurusan) {
            params.append("jurusan", jurusan);
          }

          const queryString = params.toString();
          console.log("Navigating to siswa with jurusan params:", queryString);
          router.push(`/siswa?${queryString}`);
        },
      }));
    }

    // ===== GURU DRILL DOWN =====
    if (drillState.entityType === "guru" && drillState.level === "gender") {
      return [
        {
          icon: "fas fa-mars",
          title: "Guru Laki-laki",
          value: filteredStats.guru.laki,
          action: () => {
            setDrillState({
              ...drillState,
              level: "status",
              filters: { ...drillState.filters, gender: "L" },
            });
          },
        },
        {
          icon: "fas fa-venus",
          title: "Guru Perempuan",
          value: filteredStats.guru.perempuan,
          action: () => {
            setDrillState({
              ...drillState,
              level: "status",
              filters: { ...drillState.filters, gender: "P" },
            });
          },
        },
        {
          icon: "fas fa-users",
          title: "Semua Guru",
          value: filteredStats.guru.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "status",
              filters: { ...drillState.filters },
            });
          },
        },
      ];
    }

    if (drillState.entityType === "guru" && drillState.level === "status") {
      return [
        {
          icon: "fas fa-id-card",
          title: "Guru ASN",
          value: filteredStats.guru.byStatus.ASN.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "golongan",
              filters: { ...drillState.filters, status: "ASN" },
            });
          },
        },
        {
          icon: "fas fa-id-badge",
          title: "Guru P3K",
          value: filteredStats.guru.byStatus.P3K.total,
          action: () => {
            setDrillState({
              ...drillState,
              level: "golongan",
              filters: { ...drillState.filters, status: "P3K" },
            });
          },
        },
        {
          icon: "fas fa-user-clock",
          title: "Guru Honorer",
          value: filteredStats.guru.byStatus.Honorer.total,
          action: () => {
            setDrillState({
              ...drillState,
              filters: { ...drillState.filters, status: "Honorer" },
            });
            navigateToList();
          },
        },
      ];
    }

    if (drillState.entityType === "guru" && drillState.level === "golongan") {
      const status = drillState.filters.status as "ASN" | "P3K" | "Honorer";
      const golonganData = filteredStats.guru.byStatus[status].byGolongan;

      return Object.entries(golonganData).map(([golongan, count]) => ({
        icon: "fas fa-medal",
        title: `Golongan ${golongan}`,
        value: count,
        action: () => {
          const newFilters = { ...drillState.filters, golongan };
          console.log("Setting golongan filter:", newFilters);
          setDrillState({
            ...drillState,
            filters: newFilters,
          });

          // Navigate dengan filters yang baru
          const params = new URLSearchParams();
          if (newFilters.gender) {
            params.append("jenis_kelamin", newFilters.gender);
          }
          if (newFilters.status) {
            params.append("status", newFilters.status);
          }
          if (golongan) {
            params.append("golongan", golongan);
          }

          const queryString = params.toString();
          console.log("Navigating to guru with golongan params:", queryString);
          router.push(`/guru?${queryString}`);
        },
      }));
    }

    // ===== MAPEL DRILL DOWN =====
    if (drillState.entityType === "mapel" && drillState.level === "tipe") {
      return [
        {
          icon: "fas fa-book",
          title: "Mapel Umum",
          value: filteredStats.mapel.umum,
          action: () => {
            const newFilters = { ...drillState.filters, tipe: "Umum" as const };
            console.log("Setting mapel Umum filter:", newFilters);
            setDrillState({
              ...drillState,
              filters: newFilters,
            });

            // Navigate langsung dengan filter tipe
            const params = new URLSearchParams();
            params.append("tipe_mapel", "Umum");

            const queryString = params.toString();
            console.log("Navigating to mapel Umum with params:", queryString);
            router.push(`/mapel?${queryString}`);
          },
        },
        {
          icon: "fas fa-tools",
          title: "Mapel Jurusan",
          value: filteredStats.mapel.jurusan,
          action: () => {
            setDrillState({
              ...drillState,
              level: "jurusan",
              filters: { ...drillState.filters, tipe: "Jurusan" },
            });
          },
        },
      ];
    }

    if (drillState.entityType === "mapel" && drillState.level === "jurusan") {
      const jurusanData = filteredStats.mapel.byJurusan || {};

      return Object.entries(jurusanData).map(([jurusan, count]) => ({
        icon: "fas fa-graduation-cap",
        title: jurusan,
        value: count,
        action: () => {
          const newFilters = { ...drillState.filters, jurusan };
          console.log("Setting mapel jurusan filter:", newFilters);
          setDrillState({
            ...drillState,
            filters: newFilters,
          });

          // Navigate dengan filters yang baru
          const params = new URLSearchParams();
          if (newFilters.tipe) {
            params.append("tipe_mapel", newFilters.tipe);
          }
          if (jurusan) {
            params.append("jurusan", jurusan);
          }

          const queryString = params.toString();
          console.log("Navigating to mapel with jurusan params:", queryString);
          router.push(`/mapel?${queryString}`);
        },
      }));
    }

    return [];
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {drillState.level !== "main" && (
        <div className={styles.navHeader}>
          <Button onClick={handleBack} className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            Kembali
          </Button>
          <div className={styles.breadcrumb}>
            {drillState.entityType && (
              <>
                <span>
                  {drillState.entityType.charAt(0).toUpperCase() +
                    drillState.entityType.slice(1)}
                </span>
                {drillState.filters.gender && (
                  <>
                    <i className="fas fa-chevron-right"></i>
                    <span>
                      {drillState.filters.gender === "L"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </span>
                  </>
                )}
                {drillState.filters.kelas && (
                  <>
                    <i className="fas fa-chevron-right"></i>
                    <span>Kelas {drillState.filters.kelas}</span>
                  </>
                )}
                {drillState.filters.status && (
                  <>
                    <i className="fas fa-chevron-right"></i>
                    <span>{drillState.filters.status}</span>
                  </>
                )}
                {drillState.filters.golongan && (
                  <>
                    <i className="fas fa-chevron-right"></i>
                    <span>Golongan {drillState.filters.golongan}</span>
                  </>
                )}
                {drillState.filters.tipe && (
                  <>
                    <i className="fas fa-chevron-right"></i>
                    <span>{drillState.filters.tipe}</span>
                  </>
                )}
                {drillState.filters.jurusan &&
                  drillState.entityType === "mapel" && (
                    <>
                      <i className="fas fa-chevron-right"></i>
                      <span>{drillState.filters.jurusan}</span>
                    </>
                  )}
              </>
            )}
          </div>
        </div>
      )}

      <div className={styles.statsGrid}>
        {getCards().map((card, index) => (
          <div
            key={index}
            className={`${styles.statCard} ${
              card.action ? styles.clickable : ""
            }`}
            onClick={card.action}
          >
            <div className={styles.statHeader}>
              <div className={styles.statTitle}>
                <div className={styles.statIcon}>
                  <i className={card.icon}></i>
                </div>
                <span>{card.title}</span>
              </div>
              {card.action && <i className="fas fa-chevron-right"></i>}
            </div>
            <div className={styles.statValue}>{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrillDownNav;
