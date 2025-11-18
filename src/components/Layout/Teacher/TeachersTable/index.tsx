"use client";

import { Guru } from "WT/types/teacher";
import styles from "./TeachersTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ProtectedActionButtons from "WT/components/Ui/ProtectedActionButtons";

interface TeacherTableProps {
  teachers: Guru[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (nip: string, nama: string) => void;
  onView: (guru: Guru) => void;
  onEdit: (guru: Guru) => void;
  user: SessionUser | null | undefined;
}

const TeacherTable = ({
  teachers,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: TeacherTableProps) => {
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

  const getStatusBadge = (status: string) => {
    const baseClass = styles.statusBadge;
    switch (status) {
      case "ASN":
        return `${baseClass} ${styles.statusAsn}`;
      case "P3K":
        return `${baseClass} ${styles.statusP3k}`;
      case "Honorer":
        return `${baseClass} ${styles.statusHonorer}`;
      default:
        return baseClass;
    }
  };

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>Jenis Kelamin</th>
              <th>Status</th>
              <th>No HP</th>
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

  if (teachers.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>Jenis Kelamin</th>
              <th>Status</th>
              <th>No HP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox"></i>
                  <p>Tidak ada data guru</p>
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
            <th>Nama</th>
            <th>NIP</th>
            <th>Jenis Kelamin</th>
            <th>Status</th>
            <th>No HP</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, idx) => (
            <tr key={teacher.nip} onClick={() => onView(teacher)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>
                <div className={styles.teacherDetails}>
                  <h6>{teacher.nama}</h6>
                </div>
              </td>
              <td>{teacher.nip}</td>
              <td>
                {teacher.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
              </td>
              <td>
                <span className={getStatusBadge(teacher.status)}>
                  {getStatusLabel(teacher.status)}
                </span>
              </td>
              <td>{teacher.no_hp || "-"}</td>
              <td>
                <ProtectedActionButtons
                  user={user}
                  actions={[
                    {
                      icon: "fas fa-eye",
                      title: "Lihat Detail",
                      onClick: (e) => {
                        e.stopPropagation();
                        onView(teacher);
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
                        onEdit(teacher);
                      },
                      permission: "guru.edit",
                      variant: "edit",
                    },
                    {
                      icon: "fas fa-trash",
                      title: "Hapus",
                      onClick: (e) => {
                        e.stopPropagation();
                        onDelete(teacher.nip, teacher.nama);
                      },
                      permission: "guru.delete",
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

export default TeacherTable;
