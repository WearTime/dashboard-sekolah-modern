"use client";

import { Prestasi } from "WT/types/prestasi";
import styles from "./PrestasiTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";

interface PrestasiTableProps {
  prestasi: Prestasi[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: string, nama: string) => void;
  onView: (prestasi: Prestasi) => void;
  onEdit: (prestasi: Prestasi) => void;
  user: SessionUser | null | undefined;
}

const PrestasiTable = ({
  prestasi,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: PrestasiTableProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getBadgeClass = (type: string, value: string) => {
    if (type === "recipient") {
      if (value === "Siswa") return styles.badgeSiswa;
      if (value === "Sekolah") return styles.badgeSekolah;
      if (value === "GTK") return styles.badgeGTK;
    }
    if (type === "level") {
      if (value === "Provinsi") return styles.badgeProvinsi;
      if (value === "Nasional") return styles.badgeNasional;
      if (value === "Internasional") return styles.badgeInternasional;
    }
    return "";
  };

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Prestasi</th>
              <th>Penyelenggara</th>
              <th>Penerima</th>
              <th>Tingkat</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <div className={styles.loadingState}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Memuat data...</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (prestasi.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Prestasi</th>
              <th>Penyelenggara</th>
              <th>Penerima</th>
              <th>Tingkat</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <div className={styles.emptyState}>
                  <i className="fas fa-trophy"></i>
                  <p>Tidak ada data prestasi</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>No</th>
            <th>Prestasi</th>
            <th>Penyelenggara</th>
            <th>Penerima</th>
            <th>Tingkat</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {prestasi.map((item, idx) => (
            <tr key={item.id} onClick={() => onView(item)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>
                <div className={styles.thumbnailCell}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.noThumbnail}>
                      <i className="fas fa-image"></i>
                    </div>
                  )}
                  <div className={styles.prestasiInfo}>
                    <h6>{item.name}</h6>
                  </div>
                </div>
              </td>
              <td>{item.penyelenggara}</td>
              <td>
                <span
                  className={`${styles.badge} ${getBadgeClass(
                    "recipient",
                    item.recipient_type
                  )}`}
                >
                  {item.recipient_type}
                </span>
              </td>
              <td>
                <span
                  className={`${styles.badge} ${getBadgeClass(
                    "level",
                    item.level
                  )}`}
                >
                  {item.level}
                </span>
              </td>
              <td>{formatDate(item.tanggal)}</td>
              <td>
                <div className={styles.actionButtons}>
                  <Button
                    className={`${styles.btnAction} ${styles.btnView}`}
                    title="Lihat Detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(item);
                    }}
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                  {user &&
                    (user.role === "ADMIN" || user.role === "PRINCIPAL") && (
                      <>
                        <Button
                          className={`${styles.btnAction} ${styles.btnEdit}`}
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          className={`${styles.btnAction} ${styles.btnDelete}`}
                          title="Hapus"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id, item.name);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrestasiTable;
