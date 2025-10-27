"use client";

import { Ekstrakulikuler } from "WT/types/ekstrakulikuler";
import styles from "./EkstrakulikulerTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";

interface EkstrakulikulerTableProps {
  ekstrakulikuler: Ekstrakulikuler[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: string, nama: string) => void;
  onView: (eskul: Ekstrakulikuler) => void;
  onEdit: (eskul: Ekstrakulikuler) => void;
  user: SessionUser | null | undefined;
}

const EkstrakulikulerTable = ({
  ekstrakulikuler,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: EkstrakulikulerTableProps) => {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Ekstrakulikuler</th>
              <th>Pembina/Pendamping</th>
              <th>Ketua</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
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

  if (ekstrakulikuler.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Ekstrakulikuler</th>
              <th>Pembina/Pendamping</th>
              <th>Ketua</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox"></i>
                  <p>Tidak ada data ekstrakulikuler</p>
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
            <th>Ekstrakulikuler</th>
            <th>Pembina/Pendamping</th>
            <th>Ketua</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {ekstrakulikuler.map((eskul, idx) => (
            <tr key={eskul.id} onClick={() => onView(eskul)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>
                <div className={styles.thumbnailCell}>
                  {eskul.imagesThumbnail ? (
                    <img
                      src={eskul.imagesThumbnail}
                      alt={eskul.namaEskul}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.noThumbnail}>
                      <i className="fas fa-image"></i>
                    </div>
                  )}
                  <div className={styles.eskulInfo}>
                    <h6>{eskul.namaEskul}</h6>
                  </div>
                </div>
              </td>
              <td>{eskul.pendamping}</td>
              <td>{eskul.ketua}</td>
              <td>
                <div className={styles.descriptionPreview}>
                  {eskul.description}
                </div>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <Button
                    className={`${styles.btnAction} ${styles.btnView}`}
                    title="Lihat Detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(eskul);
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
                            onEdit(eskul);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          className={`${styles.btnAction} ${styles.btnDelete}`}
                          title="Hapus"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(eskul.id, eskul.namaEskul);
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

export default EkstrakulikulerTable;