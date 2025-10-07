"use client";

import { useEffect, useState } from "react";
import { FilterOptions, Siswa } from "WT/types/student";
import styles from "./StudentsList.module.css";
import { useStudents } from "WT/hooks/useStudents";
import SearchFilter from "WT/components/Layout/Student/StudentFilter";
import StudentTable from "WT/components/Layout/Student/StudentsTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import DeleteConfirmModal from "WT/components/Layout/SiswaModal/DeleteConfirmModal";
import EditStudentModal from "WT/components/Layout/SiswaModal/EditStudentModal";
import ViewStudentModal from "WT/components/Layout/SiswaModal/ViewStudentModal";
import { useSearchParams } from "next/navigation";

const ListSiswaPage = ({ user }: { user: SessionUser | undefined }) => {
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Siswa | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    nisn: string;
    nama: string;
  } | null>(null);

  const {
    students,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = useStudents();

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setFilters({ search: "", kelas: "", jurusan: "", jenis_kelamin: "" });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleView = (siswa: Siswa) => {
    setSelectedStudent(siswa);
    setViewModalOpen(true);
  };

  const handleEdit = (siswa: Siswa) => {
    setSelectedStudent(siswa);
    setEditModalOpen(true);
  };

  const handleDelete = (nisn: string, nama: string) => {
    setStudentToDelete({ nisn, nama });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedStudent(null);
    setStudentToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };
  useEffect(() => {
    const gender = searchParams.get("jenis_kelamin");
    const kelas = searchParams.get("kelas");
    const jurusan = searchParams.get("jurusan");

    if (gender || kelas || jurusan) {
      setFilters({
        search: "",
        kelas: kelas || "",
        jurusan: jurusan || "",
        jenis_kelamin: gender || "",
      });
    }
  }, [searchParams]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <h5 className={styles.cardTitle}>Data Siswa</h5>
      </div>

      <SearchFilter
        filters={filters}
        showFilter={showFilter}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onToggleFilter={() => setShowFilter(!showFilter)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />

      <StudentTable
        students={students}
        loading={loading}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.limit}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        user={user}
      />

      {!loading && students.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}

      <ViewStudentModal
        isOpen={viewModalOpen}
        onClose={handleModalClose}
        student={selectedStudent}
      />

      <EditStudentModal
        isOpen={editModalOpen}
        onClose={handleModalClose}
        student={selectedStudent}
        onSuccess={handleSuccess}
      />

      {studentToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={handleModalClose}
          nisn={studentToDelete.nisn}
          nama={studentToDelete.nama}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
export default ListSiswaPage;
