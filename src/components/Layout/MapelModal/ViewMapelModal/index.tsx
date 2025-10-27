"use client";

import { useState, useEffect } from "react";
import { MapelGuruRelation, MapelWithRelations } from "WT/types/mapel";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";
import { useMapel } from "WT/hooks/useMapel";
import styles from "./ViewMapelModal.module.css";

interface ViewMapelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapel: MapelWithRelations | null;
}

const ViewMapelModal = ({ isOpen, onClose, mapel }: ViewMapelModalProps) => {
  const [mapelGuru, setMapelGuru] = useState<MapelGuruRelation[]>([]);
  const { fetchMapelGuru } = useMapel();
  const [loadingGuru, setLoadingGuru] = useState(false);

  useEffect(() => {
    if (mapel && isOpen) {
      setLoadingGuru(true);
      fetchMapelGuru(mapel.kode_mapel)
        .then((data) => setMapelGuru(data))
        .finally(() => setLoadingGuru(false));
    }
  }, [mapel, isOpen, fetchMapelGuru]);

  if (!mapel) return null;

  const getTipeMapelBadge = (tipe: string) => {
    const badges: { [key: string]: string } = {
      Umum: styles.badgeUmum,
      Kejuruan: styles.badgeKejuruan,
      Mulok: styles.badgeMulok,
    };
    return badges[tipe] || styles.badgeDefault;
  };

  const sections: InfoSection[] = [
    {
      title: "Informasi Mata Pelajaran",
      items: [
        { label: "Nama Mata Pelajaran", value: mapel.nama_mapel },
        { label: "Kode Mapel", value: mapel.kode_mapel },
        { label: "Fase", value: mapel.fase },
        {
          label: "Tipe Mapel",
          value: (
            <span
              className={`${styles.badge} ${getTipeMapelBadge(
                mapel.tipe_mapel
              )}`}
            >
              {mapel.tipe_mapel}
            </span>
          ),
        },
        ...(mapel.jurusan && mapel.jurusan !== "Semua"
          ? [{ label: "Jurusan", value: mapel.jurusan }]
          : []),
      ],
    },
  ];

  const guruSection = (
    <div className={styles.infoGroup}>
      <h6 className={styles.infoLabel}>
        Guru Pengampu
        {loadingGuru && (
          <i
            className="fas fa-spinner fa-spin"
            style={{ marginLeft: "8px", fontSize: "14px" }}
          ></i>
        )}
      </h6>
      {loadingGuru ? (
        <div className={styles.loadingGuru}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Memuat data guru...</span>
        </div>
      ) : mapelGuru.length > 0 ? (
        <div className={styles.guruList}>
          {mapelGuru.map((mg) => (
            <div key={mg.id} className={styles.guruCard}>
              <div className={styles.guruHeader}>
                <div className={styles.guruTitle}>
                  <i className="fas fa-user"></i>
                  <span className={styles.guruName}>{mg.guru?.nama}</span>
                </div>
              </div>
              <div className={styles.guruDetails}>
                <div className={styles.guruDetailItem}>
                  <i className="fas fa-id-card"></i>
                  <span>NIP: {mg.guru?.nip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noGuru}>
          <i className="fas fa-info-circle"></i>
          <span>Belum ada guru pengampu</span>
        </div>
      )}
    </div>
  );

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Mata Pelajaran"
      sections={sections}
      extraContent={guruSection}
    />
  );
};

export default ViewMapelModal;
