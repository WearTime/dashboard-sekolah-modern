"use client";

import { useState } from "react";
import { ProgramSekolah, TipeProgram } from "WT/types/program";
import styles from "./ProgramList.module.css";
import { useProgram } from "WT/hooks/useProgram";
import ProgramTable from "WT/components/Layout/Program/ProgramTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ViewModal from "WT/components/Layout/ProgramModal/ViewProgramModal";
import DeleteConfirmModal from "WT/components/Layout/ProgramModal/DeleteConfirmModal";
import EditModal from "../../ProgramModal/EditProgramModal";

interface ProgramListProps {
  user: SessionUser | null | undefined;
  onBack: () => void;
  tipeProgram: TipeProgram;
}

const ProgramList = ({ user, onBack, tipeProgram }: ProgramListProps) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramSekolah | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<{
    id: string;
    judul: string;
  } | null>(null);

  const {
    programs,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = useProgram(tipeProgram);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleView = (program: ProgramSekolah) => {
    setSelectedProgram(program);
    setViewModalOpen(true);
  };

  const handleEdit = (program: ProgramSekolah) => {
    setSelectedProgram(program);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string, judul: string) => {
    setProgramToDelete({ id, judul });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedProgram(null);
    setProgramToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.cardContainer}>
        <div className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>List Program {tipeProgram}</h5>
          <div className={styles.headerActions}>
            <Button className={styles.btnBack} onClick={onBack}>
              <i className="fas fa-arrow-left"></i>
              <span>Kembali</span>
            </Button>
          </div>
        </div>

        <div className={styles.searchBox}>
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari program..."
          />
          {filters.search && (
            <i
              className={`fas fa-times ${styles.clearIcon}`}
              onClick={() => handleSearchChange("")}
            ></i>
          )}
        </div>

        <ProgramTable
          programs={programs}
          loading={loading}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.limit}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          user={user}
        />

        {!loading && programs.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={setCurrentPage}
          />
        )}

        <ViewModal
          isOpen={viewModalOpen}
          onClose={handleModalClose}
          program={selectedProgram}
        />

        <EditModal
          isOpen={editModalOpen}
          onClose={handleModalClose}
          program={selectedProgram}
          onSuccess={handleSuccess}
        />

        {programToDelete && (
          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            onClose={handleModalClose}
            id={programToDelete.id}
            judul={programToDelete.judul}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ProgramList;
