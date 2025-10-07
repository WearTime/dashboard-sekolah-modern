"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrillState, StatCardData } from "WT/types/drilldown";
import useDashboardStats from "WT/hooks/useDrillDown";
import styles from "./DrillDownNav.module.css";
import Button from "WT/components/Ui/Button";

const DrillDownNav = () => {
  const router = useRouter();
  const { stats, loading } = useDashboardStats();
  const [drillState, setDrillState] = useState<DrillState>({
    level: "main",
    filters: {},
    entityType: null,
  });

  const handleDrillDown = (
    entityType: "siswa" | "guru" | "stafftu",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: any
  ) => {
    setDrillState({
      level: filters ? drillState.level : "gender",
      filters: { ...drillState.filters, ...filters },
      entityType,
    });
  };

  const handleBack = () => {
    const levels: DrillState["level"][] = [
      "main",
      "gender",
      "kelas",
      "jurusan",
    ];
    const currentIndex = levels.indexOf(drillState.level);

    if (currentIndex > 0) {
      const newLevel = levels[currentIndex - 1];
      const newFilters = { ...drillState.filters };

      if (newLevel === "main") {
        setDrillState({ level: "main", filters: {}, entityType: null });
      } else if (newLevel === "gender") {
        delete newFilters.kelas;
        delete newFilters.jurusan;
        setDrillState({ ...drillState, level: newLevel, filters: newFilters });
      } else if (newLevel === "kelas") {
        delete newFilters.jurusan;
        setDrillState({ ...drillState, level: newLevel, filters: newFilters });
      }
    }
  };

  const navigateToList = () => {
    const params = new URLSearchParams();

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
  };

  const getCards = (): StatCardData[] => {
    if (!stats) return [];

    if (drillState.level === "main") {
      return [
        {
          icon: "fas fa-user-graduate",
          title: "Total Siswa",
          value: stats.siswa.total,
          action: () => handleDrillDown("siswa"),
        },
        {
          icon: "fas fa-chalkboard-teacher",
          title: "Total Guru",
          value: stats.guru.total,
          action: () => handleDrillDown("guru"),
        },
        {
          icon: "fas fa-book-open",
          title: "Total Mapel",
          value: stats.mapel.total,
        },
        {
          icon: "fas fa-users",
          title: "Total Ekstrakulikuler",
          value: stats.ekstra.total,
        },
        {
          icon: "fas fa-sitemap",
          title: "Struktur Organisasi",
          value: "-",
        },
        {
          icon: "fas fa-user-tie",
          title: "Total Staff TU",
          value: stats.stafftu.total,
          action: () => handleDrillDown("stafftu"),
        },
      ];
    }

    if (drillState.entityType === "siswa" && drillState.level === "gender") {
      return [
        {
          icon: "fas fa-mars",
          title: "Siswa Laki-laki",
          value: stats.siswa.laki,
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
          value: stats.siswa.perempuan,
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
          value: stats.siswa.total,
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
          value: stats.siswa.byKelas.X.total,
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
          value: stats.siswa.byKelas.XI.total,
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
          value: stats.siswa.byKelas.XII.total,
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
      const jurusanData = stats.siswa.byKelas[kelas].byJurusan;

      return Object.entries(jurusanData).map(([jurusan, count]) => ({
        icon: "fas fa-book",
        title: jurusan,
        value: count,
        action: () => {
          setDrillState({
            ...drillState,
            filters: { ...drillState.filters, jurusan },
          });
          navigateToList();
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
