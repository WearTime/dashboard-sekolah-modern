"use client";

import { ProgramSekolah } from "WT/types/program";
import styles from "./ProgramTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";

interface ProgramTableProps {
  programs: ProgramSekolah[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: string, judul: string) => void;
  onView: (program: ProgramSekolah) => void;
  onEdit: (program: ProgramSekolah) => void;
  user: SessionUser | null | undefined;
}

const ProgramTable = ({
  programs,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: ProgramTableProps) => {
  const canEdit = (program: ProgramSekolah): boolean => {
    if (!user || !user.permissions) return false;

    const tipe = program.tipe_program.toLowerCase();
    const permissionName = `program.${tipe}.edit`;
    return user.permissions.includes(permissionName);
  };

  const canDelete = (program: ProgramSekolah): boolean => {
    if (!user || !user.permissions) return false;

    const tipe = program.tipe_program.toLowerCase();
    const permissionName = `program.${tipe}.delete`;
    return user.permissions.includes(permissionName);
  };

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Program</th>
              <th>Tipe</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5}>
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

  if (programs.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Program</th>
              <th>Tipe</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5}>
                <div className={styles.emptyState}>
                  <i className="fas fa-folder-open"></i>
                  <p>Tidak ada data program</p>
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
            <th>Program</th>
            <th>Tipe</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program, idx) => (
            <tr key={program.id} onClick={() => onView(program)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>
                <div className={styles.thumbnailCell}>
                  {program.thumbnail ? (
                    <img
                      src={program.thumbnail}
                      alt={program.judul}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.noThumbnail}>
                      <i className="fas fa-image"></i>
                    </div>
                  )}
                  <div className={styles.programInfo}>
                    <h6>{program.judul}</h6>
                  </div>
                </div>
              </td>
              <td>{program.tipe_program}</td>
              <td>
                <div className={styles.descriptionPreview}>
                  {program.deskripsi}
                </div>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <Button
                    className={`${styles.btnAction} ${styles.btnView}`}
                    title="Lihat Detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(program);
                    }}
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                  {user && (
                    <>
                      {canEdit(program) && (
                        <Button
                          className={`${styles.btnAction} ${styles.btnEdit}`}
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(program);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      )}
                      {canDelete(program) && (
                        <Button
                          className={`${styles.btnAction} ${styles.btnDelete}`}
                          title="Hapus"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(program.id, program.judul);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
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

export default ProgramTable;
