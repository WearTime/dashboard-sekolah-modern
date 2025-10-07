"use client";

import { Siswa } from "WT/types/student";
import Modal from "WT/components/Layout/Modal";
import styles from "./ViewStudentModal.module.css";
import Button from "WT/components/Ui/Button";

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Siswa | null;
}

const ViewStudentModal = ({
  isOpen,
  onClose,
  student,
}: ViewStudentModalProps) => {
  if (!student) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Siswa" size="large">
      <div className={styles.studentDetail}>
        <div className={styles.imageSection}>
          {student.image ? (
            <img
              src={student.image}
              alt={student.nama}
              className={styles.studentImage}
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
                <span className={styles.value}>{student.nama}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>NISN</span>
                <span className={styles.value}>{student.nisn}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Jenis Kelamin</span>
                <span className={styles.value}>
                  {student.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tempat Lahir</span>
                <span className={styles.value}>
                  {student.tempat_lahir || "-"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tanggal Lahir</span>
                <span className={styles.value}>
                  {student.tanggal_lahir
                    ? formatDate(student.tanggal_lahir)
                    : "-"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>No. HP</span>
                <span className={styles.value}>{student.no_hp || "-"}</span>
              </div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <h6 className={styles.infoLabel}>Informasi Akademik</h6>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Kelas</span>
                <span className={styles.value}>{student.kelas}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Jurusan</span>
                <span className={styles.value}>{student.jurusan}</span>
              </div>
            </div>
          </div>

          {student.alamat && (
            <div className={styles.infoGroup}>
              <h6 className={styles.infoLabel}>Alamat</h6>
              <p className={styles.alamatText}>{student.alamat}</p>
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

export default ViewStudentModal;
