"use client";

import { useState, useEffect } from "react";
import { MapelGuruRelation, MapelWithRelations } from "WT/types/mapel";
import Modal from "WT/components/Layout/Modal";
import styles from "./ViewMapelModal.module.css";
import Button from "WT/components/Ui/Button";
import { useMapel } from "WT/hooks/useMapel";

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
      Jurusan: styles.badgeJurusan,
    };
    return badges[tipe] || styles.badgeDefault;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Mata Pelajaran"
      size="large"
    >
      <div className={styles.mapelDetail}>
        <div className={styles.infoSection}>
          <div className={styles.infoGroup}>
            <h6 className={styles.infoLabel}>Informasi Mata Pelajaran</h6>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Nama Mata Pelajaran</span>
                <span className={styles.value}>{mapel.nama_mapel}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Kode Mapel</span>
                <span className={styles.value}>{mapel.kode_mapel}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Fase</span>
                <span className={styles.value}>{mapel.fase}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tipe Mapel</span>
                <span
                  className={`${styles.badge} ${getTipeMapelBadge(
                    mapel.tipe_mapel
                  )}`}
                >
                  {mapel.tipe_mapel}
                </span>
              </div>
              {mapel.jurusan && mapel.jurusan !== "Semua" && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Jurusan</span>
                  <span className={styles.value}>{mapel.jurusan}</span>
                </div>
              )}
            </div>
          </div>

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
        </div>

        <div className={styles.modalActions}>
          <Button className={styles.btnClose} onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMapelModal;
