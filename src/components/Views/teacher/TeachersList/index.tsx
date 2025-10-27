"use client";

import { useEffect, useState } from "react";
import { FilterOptionsGuru, Guru } from "WT/types/teacher";
import styles from "./TeachersList.module.css";
import { useTeachers } from "WT/hooks/useTeacher";
import SearchFilter from "WT/components/Layout/Teacher/TeacherFilter";
import TeacherTable from "WT/components/Layout/Teacher/TeachersTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import { useSearchParams } from "next/navigation";
import ViewTeacherModal from "WT/components/Layout/TeacherModal/ViewTeacherModal";
import DeleteConfirmModal from "WT/components/Layout/TeacherModal/DeleteConfirmModal";
import EditTeacherModal from "WT/components/Layout/TeacherModal/EditTeacherModal";

const ListGuruPage = ({ user }: { user: SessionUser | null | undefined }) => {
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Guru | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<{
    nip: string;
    nama: string;
  } | null>(null);

  const {
    teachers,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = useTeachers();

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterOptionsGuru, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setFilters({ search: "", status: "", jenis_kelamin: "" });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleView = (guru: Guru) => {
    setSelectedTeacher(guru);
    setViewModalOpen(true);
  };

  const handleEdit = (guru: Guru) => {
    setSelectedTeacher(guru);
    setEditModalOpen(true);
  };

  const handleDelete = (nip: string, nama: string) => {
    setTeacherToDelete({ nip, nama });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedTeacher(null);
    setTeacherToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };

  useEffect(() => {
    const gender = searchParams.get("jenis_kelamin");
    const status = searchParams.get("status");

    if (gender || status) {
      setFilters({
        search: "",
        status: status || "",
        jenis_kelamin: gender || "",
      });
    }
  }, [searchParams, setFilters]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <h5 className={styles.cardTitle}>Data Guru</h5>
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

      <TeacherTable
        teachers={teachers}
        loading={loading}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.limit}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        user={user}
      />

      {!loading && teachers.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}

      <ViewTeacherModal
        isOpen={viewModalOpen}
        onClose={handleModalClose}
        teacher={selectedTeacher}
      />

      <EditTeacherModal
        isOpen={editModalOpen}
        onClose={handleModalClose}
        teacher={selectedTeacher}
        onSuccess={handleSuccess}
      />

      {teacherToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={handleModalClose}
          nip={teacherToDelete.nip}
          nama={teacherToDelete.nama}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ListGuruPage;
