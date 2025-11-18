"use client";

import { ProgramJurusan, Jurusan } from "WT/types/program";
import styles from "../ProgramTable/ProgramTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ProtectedActionButtons from "WT/components/Ui/ProtectedActionButtons";

interface ProgramJurusanTableProps {
  programs: ProgramJurusan[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: string, judul: string) => void;
  onView: (program: ProgramJurusan) => void;
  onEdit: (program: ProgramJurusan) => void;
  user: SessionUser | null | undefined;
  jurusan: Jurusan;
}

const ProgramJurusanTable = ({
  programs,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
  jurusan,
}: ProgramJurusanTableProps) => {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Program</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>
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
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>
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
              <td>
                <div className={styles.descriptionPreview}>
                  {program.deskripsi}
                </div>
              </td>
              <td>
                <ProtectedActionButtons
                  user={user}
                  actions={[
                    {
                      icon: "fas fa-eye",
                      title: "Lihat Detail",
                      onClick: (e) => {
                        e.stopPropagation();
                        onView(program);
                      },
                      permission: "",
                      variant: "view",
                      needPermission: false,
                    },
                    {
                      icon: "fas fa-edit",
                      title: "Edit",
                      onClick: (e) => {
                        e.stopPropagation();
                        onEdit(program);
                      },
                      permission: `program.jurusan.${jurusan.kode.toLowerCase()}.edit`,
                      variant: "edit",
                    },
                    {
                      icon: "fas fa-trash",
                      title: "Hapus",
                      onClick: (e) => {
                        e.stopPropagation();
                        onDelete(program.id, program.judul);
                      },
                      permission: `program.jurusan.${jurusan.kode.toLowerCase()}.delete`,
                      variant: "delete",
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramJurusanTable;
