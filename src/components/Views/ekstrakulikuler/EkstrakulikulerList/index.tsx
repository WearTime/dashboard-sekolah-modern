"use client";

import { useState } from "react";
import { Ekstrakulikuler } from "WT/types/ekstrakulikuler";
import styles from "./EkstrakulikulerList.module.css";
import { useEkstrakulikuler } from "WT/hooks/useEkstrakulikuler";
import EkstrakulikulerTable from "WT/components/Layout/Ekstrakulikuler/EkstrakulikulerTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ViewModal from "WT/components/Layout/EskulModal/ViewEskulModal";
import EditModal from "WT/components/Layout/EskulModal/EditEskulModal";
import DeleteConfirmModal from "WT/components/Layout/EskulModal/DeleteConfirmModal";

interface EkstrakulikulerListProps {
  user: SessionUser | null | undefined;
  onBack: () => void;
}

const EkstrakulikulerList = ({ user, onBack }: EkstrakulikulerListProps) => {
  const [selectedEskul, setSelectedEskul] = useState<Ekstrakulikuler | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eskulToDelete, setEskulToDelete] = useState<{
    id: string;
    nama: string;
  } | null>(null);

  const {
    ekstrakulikuler,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = useEkstrakulikuler();

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleView = (eskul: Ekstrakulikuler) => {
    setSelectedEskul(eskul);
    setViewModalOpen(true);
  };

  const handleEdit = (eskul: Ekstrakulikuler) => {
    setSelectedEskul(eskul);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    setEskulToDelete({ id, nama });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedEskul(null);
    setEskulToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.cardContainer}>
        <div className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>List Ekstrakulikuler</h5>
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
            placeholder="Cari ekstrakulikuler, pembina, atau ketua..."
          />
          {filters.search && (
            <i
              className={`fas fa-times ${styles.clearIcon}`}
              onClick={() => handleSearchChange("")}
            ></i>
          )}
        </div>

        <EkstrakulikulerTable
          ekstrakulikuler={ekstrakulikuler}
          loading={loading}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.limit}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          user={user}
        />

        {!loading && ekstrakulikuler.length > 0 && (
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
          eskul={selectedEskul}
        />

        <EditModal
          isOpen={editModalOpen}
          onClose={handleModalClose}
          eskul={selectedEskul}
          onSuccess={handleSuccess}
        />

        {eskulToDelete && (
          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            onClose={handleModalClose}
            id={eskulToDelete.id}
            nama={eskulToDelete.nama}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default EkstrakulikulerList;