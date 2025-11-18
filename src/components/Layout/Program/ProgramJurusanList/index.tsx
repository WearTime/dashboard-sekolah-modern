"use client";

import { useState } from "react";
import { ProgramJurusan, Jurusan } from "WT/types/program";
import styles from "../../../Layout/Program/ProgramList/ProgramList.module.css";
import { useProgramJurusan } from "WT/hooks/useProgramJurusan";
import ProgramJurusanTable from "WT/components/Layout/Program/ProgramJurusanTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ViewProgramJurusanModal from "WT/components/Layout/ProgramJurusanModal/ViewProgramJurusanModal";
import EditProgramJurusanModal from "WT/components/Layout/ProgramJurusanModal/EditProgramJurusanModal";
import DeleteProgramJurusanModal from "WT/components/Layout/ProgramJurusanModal/DeleteConfirmModal";

interface ProgramJurusanListProps {
  user: SessionUser | null | undefined;
  onBack: () => void;
  jurusan: Jurusan;
}

const ProgramJurusanList = ({
  user,
  onBack,
  jurusan,
}: ProgramJurusanListProps) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramJurusan | null>(
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
  } = useProgramJurusan(jurusan.kode);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleView = (program: ProgramJurusan) => {
    setSelectedProgram(program);
    setViewModalOpen(true);
  };

  const handleEdit = (program: ProgramJurusan) => {
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
          <h5 className={styles.cardTitle}>List Program {jurusan.nama}</h5>
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

        <ProgramJurusanTable
          programs={programs}
          loading={loading}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.limit}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          user={user}
          jurusan={jurusan}
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

        <ViewProgramJurusanModal
          isOpen={viewModalOpen}
          onClose={handleModalClose}
          program={selectedProgram}
        />

        <EditProgramJurusanModal
          isOpen={editModalOpen}
          onClose={handleModalClose}
          program={selectedProgram}
          onSuccess={handleSuccess}
        />

        {programToDelete && (
          <DeleteProgramJurusanModal
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

export default ProgramJurusanList;
