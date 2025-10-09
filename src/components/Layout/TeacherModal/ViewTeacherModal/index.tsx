"use client";

import { useState, useEffect } from "react";
import { GuruWithRelations } from "WT/types/teacher";
import Modal from "WT/components/Layout/Modal";
import styles from "./ViewTeacherModal.module.css";
import Button from "WT/components/Ui/Button";
import { useTeachers } from "WT/hooks/useTeacher";

interface ViewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: GuruWithRelations | null;
}

interface GuruMapelRelation {
  id: string;
  kode_mapel: string;
  nip_guru: string;
  mapel: {
    kode_mapel: string;
    nama_mapel: string;
    fase: string;
    tipe_mapel: string;
    jurusan: string;
  };
}

const ViewTeacherModal = ({
  isOpen,
  onClose,
  teacher,
}: ViewTeacherModalProps) => {
  const [guruMapel, setGuruMapel] = useState<GuruMapelRelation[]>([]);
  const { fetchGuruMapel } = useTeachers();
  const [loadingMapel, setLoadingMapel] = useState(false);

  useEffect(() => {
    if (teacher && isOpen) {
      setLoadingMapel(true);
      fetchGuruMapel(teacher.nip)
        .then((data) => setGuruMapel(data))
        .finally(() => setLoadingMapel(false));
    }
  }, [teacher, isOpen, fetchGuruMapel]);

  if (!teacher) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ASN":
        return "ASN";
      case "P3K":
        return "P3K";
      case "Honorer":
        return "Honorer";
      default:
        return status;
    }
  };

  const getTipeMapelBadge = (tipe: string) => {
    const badges: { [key: string]: string } = {
      Umum: styles.badgeUmum,
      Kejuruan: styles.badgeKejuruan,
      Mulok: styles.badgeMulok,
    };
    return badges[tipe] || styles.badgeDefault;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Guru" size="large">
      <div className={styles.teacherDetail}>
        <div className={styles.imageSection}>
          {teacher.image ? (
            <img
              src={teacher.image}
              alt={teacher.nama}
              className={styles.teacherImage}
            />
          ) : (
            <div className={styles.noImage}>
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGroup}>
            <h6 className={styles.infoLabel}>Informasi Pribadi</h6>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Nama Lengkap</span>
                <span className={styles.value}>{teacher.nama}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>NIP</span>
                <span className={styles.value}>{teacher.nip}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Jenis Kelamin</span>
                <span className={styles.value}>
                  {teacher.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>No. HP</span>
                <span className={styles.value}>{teacher.no_hp || "-"}</span>
              </div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <h6 className={styles.infoLabel}>Informasi Kepegawaian</h6>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Status</span>
                <span className={styles.value}>
                  {getStatusLabel(teacher.status)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Golongan</span>
                <span className={styles.value}>{teacher.golongan || "-"}</span>
              </div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <h6 className={styles.infoLabel}>
              Mata Pelajaran yang Diampu
              {loadingMapel && (
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginLeft: "8px", fontSize: "14px" }}
                ></i>
              )}
            </h6>
            {loadingMapel ? (
              <div className={styles.loadingMapel}>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Memuat data mata pelajaran...</span>
              </div>
            ) : guruMapel.length > 0 ? (
              <div className={styles.mapelList}>
                {guruMapel.map((gm) => (
                  <div key={gm.id} className={styles.mapelCard}>
                    <div className={styles.mapelHeader}>
                      <div className={styles.mapelTitle}>
                        <i className="fas fa-book"></i>
                        <span className={styles.mapelName}>
                          {gm.mapel.nama_mapel}
                        </span>
                      </div>
                      <span
                        className={`${styles.badge} ${getTipeMapelBadge(
                          gm.mapel.tipe_mapel
                        )}`}
                      >
                        {gm.mapel.tipe_mapel}
                      </span>
                    </div>
                    <div className={styles.mapelDetails}>
                      <div className={styles.mapelDetailItem}>
                        <i className="fas fa-tag"></i>
                        <span>Kode: {gm.mapel.kode_mapel}</span>
                      </div>
                      <div className={styles.mapelDetailItem}>
                        <i className="fas fa-layer-group"></i>
                        <span>Fase: {gm.mapel.fase}</span>
                      </div>
                      {gm.mapel.jurusan && gm.mapel.jurusan !== "Semua" && (
                        <div className={styles.mapelDetailItem}>
                          <i className="fas fa-graduation-cap"></i>
                          <span>Jurusan: {gm.mapel.jurusan}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noMapel}>
                <i className="fas fa-info-circle"></i>
                <span>Belum mengampu mata pelajaran</span>
              </div>
            )}
          </div>

          {teacher.alamat && (
            <div className={styles.infoGroup}>
              <h6 className={styles.infoLabel}>Alamat</h6>
              <p className={styles.alamatText}>{teacher.alamat}</p>
            </div>
          )}
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

export default ViewTeacherModal;
