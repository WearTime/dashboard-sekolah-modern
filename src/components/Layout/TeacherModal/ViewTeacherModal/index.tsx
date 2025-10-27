"use client";

import { useState, useEffect } from "react";
import { GuruWithRelations } from "WT/types/teacher";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";
import { useTeachers } from "WT/hooks/useTeacher";
import styles from "./ViewTeacherModal.module.css";

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
    const labels: { [key: string]: string } = {
      ASN: "ASN",
      P3K: "P3K",
      Honorer: "Honorer",
    };
    return labels[status] || status;
  };

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
      title: "Informasi Pribadi",
      items: [
        { label: "Nama Lengkap", value: teacher.nama },
        { label: "NIP", value: teacher.nip },
        {
          label: "Jenis Kelamin",
          value: teacher.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
        },
        { label: "No. HP", value: teacher.no_hp || "-" },
      ],
    },
    {
      title: "Informasi Kepegawaian",
      items: [
        { label: "Status", value: getStatusLabel(teacher.status) },
        { label: "Golongan", value: teacher.golongan || "-" },
      ],
    },
  ];

  const mapelSection = (
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
  );

  const alamatSection = teacher.alamat ? (
    <div className={styles.infoGroup}>
      <h6 className={styles.infoLabel}>Alamat</h6>
      <p className={styles.alamatText}>{teacher.alamat}</p>
    </div>
  ) : null;

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Guru"
      image={teacher.image ?? undefined}
      imageAlt={teacher.nama}
      sections={sections}
      extraContent={
        <>
          {mapelSection}
          {alamatSection}
        </>
      }
    />
  );
};

export default ViewTeacherModal;
