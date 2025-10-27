"use client";

import { Siswa } from "WT/types/student";
import styles from "./StudentsTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";

interface StudentTableProps {
  students: Siswa[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (nisn: string, nama: string) => void;
  onView: (siswa: Siswa) => void;
  onEdit: (siswa: Siswa) => void;
  user: SessionUser | null | undefined;
}

const StudentTable = ({
  students,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: StudentTableProps) => {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NISN</th>
              <th>Kelas</th>
              <th>Jurusan</th>
              <th>Jenis Kelamin</th>
              <th>No HP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8}>
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

  if (students.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NISN</th>
              <th>Kelas</th>
              <th>Jurusan</th>
              <th>Jenis Kelamin</th>
              <th>No HP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8}>
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox"></i>
                  <p>Tidak ada data siswa</p>
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
            <th>NISN</th>
            <th>Kelas</th>
            <th>Jurusan</th>
            <th>Jenis Kelamin</th>
            <th>No HP</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={student.nisn} onClick={() => onView(student)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>
                <div className={styles.studentDetails}>
                  <h6>{student.nama}</h6>
                </div>
              </td>
              <td>{student.nisn}</td>
              <td>{student.kelas}</td>
              <td>{student.jurusan}</td>
              <td>
                {student.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
              </td>
              <td>{student.no_hp || "-"}</td>
              <td>
                <div className={styles.actionButtons}>
                  <Button
                    className={`${styles.btnAction} ${styles.btnView}`}
                    title="Lihat Detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(student);
                    }}
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                  {user &&
                    (user.role == "ADMIN" || user?.role == "PRINCIPAL") && (
                      <>
                        <Button
                          className={`${styles.btnAction} ${styles.btnEdit}`}
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(student);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          className={`${styles.btnAction} ${styles.btnDelete}`}
                          title="Hapus"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(student.nisn, student.nama);
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

export default StudentTable;
