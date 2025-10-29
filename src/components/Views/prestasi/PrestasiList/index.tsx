"use client";

import { useState } from "react";
import { Prestasi } from "WT/types/prestasi";
import styles from "./PrestasiList.module.css";
import { usePrestasi } from "WT/hooks/usePrestasi";
import PrestasiTable from "WT/components/Layout/Prestasi/PrestasiTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ViewModal from "WT/components/Layout/PrestasiModal/ViewPrestasiModal";
import EditModal from "WT/components/Layout/PrestasiModal/EditPrestasiModal";
import DeleteConfirmModal from "WT/components/Layout/PrestasiModal/DeleteConfirmModal";

interface PrestasiListProps {
  user: SessionUser | null | undefined;
  onBack: () => void;
  prestasiType: "Siswa" | "Sekolah" | "GTK";
  level?: "Provinsi" | "Nasional" | "Internasional";
}

const PrestasiList = ({
  user,
  onBack,
  prestasiType,
  level,
}: PrestasiListProps) => {
  const [selectedPrestasi, setSelectedPrestasi] = useState<Prestasi | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prestasiToDelete, setPrestasiToDelete] = useState<{
    id: string;
    nama: string;
  } | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const {
    prestasi,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = usePrestasi(prestasiType, level);

  const getTitle = () => {
    if (level) {
      return `List Prestasi ${prestasiType} ${level}`;
    }
    return `List Prestasi ${prestasiType}`;
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setFilters({ search: "", recipient_type: "", level: "" });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleView = (prestasi: Prestasi) => {
    setSelectedPrestasi(prestasi);
    setViewModalOpen(true);
  };

  const handleEdit = (prestasi: Prestasi) => {
    setSelectedPrestasi(prestasi);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    setPrestasiToDelete({ id, nama });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedPrestasi(null);
    setPrestasiToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.cardContainer}>
        <div className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>{getTitle()}</h5>
          <div className={styles.headerActions}>
            <Button className={styles.btnBack} onClick={onBack}>
              <i className="fas fa-arrow-left"></i>
              <span>Kembali</span>
            </Button>
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.searchBox}>
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari prestasi, penyelenggara..."
            />
            {filters.search && (
              <i
                className={`fas fa-times ${styles.clearIcon}`}
                onClick={() => handleSearchChange("")}
              ></i>
            )}
          </div>

          <Button
            className={styles.btnFilter}
            onClick={() => setShowFilter(!showFilter)}
          >
            <i className="fas fa-filter"></i>
            <span>Filter</span>
          </Button>
        </div>

        {showFilter && (
          <div className={styles.filterBox}>
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label>Penerima</label>
                <select
                  value={filters.recipient_type}
                  onChange={(e) =>
                    handleFilterChange("recipient_type", e.target.value)
                  }
                >
                  <option value="">Semua</option>
                  <option value="Siswa">Siswa</option>
                  <option value="Sekolah">Sekolah</option>
                  <option value="GTK">GTK</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Tingkat</label>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange("level", e.target.value)}
                >
                  <option value="">Semua</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
              </div>
            </div>

            <div className={styles.filterActions}>
              <Button className={styles.btnReset} onClick={handleResetFilter}>
                <i className="fas fa-redo"></i>
                <span>Reset</span>
              </Button>
              <Button className={styles.btnApply} onClick={handleApplyFilter}>
                <i className="fas fa-check"></i>
                <span>Terapkan</span>
              </Button>
            </div>
          </div>
        )}

        <PrestasiTable
          prestasi={prestasi}
          loading={loading}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.limit}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          user={user}
        />

        {!loading && prestasi.length > 0 && (
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
          prestasi={selectedPrestasi}
        />

        <EditModal
          isOpen={editModalOpen}
          onClose={handleModalClose}
          prestasi={selectedPrestasi}
          onSuccess={handleSuccess}
        />

        {prestasiToDelete && (
          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            onClose={handleModalClose}
            id={prestasiToDelete.id}
            nama={prestasiToDelete.nama}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default PrestasiList;
