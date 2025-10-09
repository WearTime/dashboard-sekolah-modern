"use client";

import { useEffect, useState } from "react";
import { FilterOptionsMapel, Mapel } from "WT/types/mapel";
import styles from "./MapelsList.module.css";
import { useMapel } from "WT/hooks/useMapel";
import SearchFilter from "WT/components/Layout/Mapel/MapelFilter";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import { useSearchParams } from "next/navigation";
import ViewMapelModal from "WT/components/Layout/MapelModal/ViewMapelModal";
import DeleteConfirmModal from "WT/components/Layout/MapelModal/DeleteConfirmModal";
import EditMapelModal from "WT/components/Layout/MapelModal/EditMapelModal";
import MapelTable from "WT/components/Layout/Mapel/MapelsTable";

const ListMapelPage = ({ user }: { user: SessionUser | undefined }) => {
  const searchParams = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mapelToDelete, setMapelToDelete] = useState<{
    kode_mapel: string;
    nama_mapel: string;
  } | null>(null);

  const {
    mapel,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = useMapel();

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterOptionsMapel, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setFilters({ search: "", tipe_mapel: "", jurusan: "" });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleView = (mapel: Mapel) => {
    setSelectedMapel(mapel);
    setViewModalOpen(true);
  };

  const handleEdit = (mapel: Mapel) => {
    setSelectedMapel(mapel);
    setEditModalOpen(true);
  };

  const handleDelete = (kode_mapel: string, nama_mapel: string) => {
    setMapelToDelete({ kode_mapel, nama_mapel });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedMapel(null);
    setMapelToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };

  useEffect(() => {
    const tipe = searchParams.get("tipe_mapel");
    const jurusan = searchParams.get("jurusan");

    if (tipe || jurusan) {
      setFilters({
        search: "",
        tipe_mapel: tipe || "",
        jurusan: jurusan || "",
      });
    }
  }, [searchParams, setFilters]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <h5 className={styles.cardTitle}>Data Mata Pelajaran</h5>
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

      <MapelTable
        mapel={mapel}
        loading={loading}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.limit}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        user={user}
      />

      {!loading && mapel.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}

      <ViewMapelModal
        isOpen={viewModalOpen}
        onClose={handleModalClose}
        mapel={selectedMapel}
      />

      <EditMapelModal
        isOpen={editModalOpen}
        onClose={handleModalClose}
        mapel={selectedMapel}
        onSuccess={handleSuccess}
      />

      {mapelToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={handleModalClose}
          kode_mapel={mapelToDelete.kode_mapel}
          nama_mapel={mapelToDelete.nama_mapel}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ListMapelPage;
