"use client";

import { useState } from "react";
import { User } from "WT/types/user";
import styles from "./UsersList.module.css";
import { useUsers } from "WT/hooks/useUsers";
import SearchFilter from "WT/components/Layout/User/UserFilter";
import UserTable from "WT/components/Layout/User/UsersTable";
import Pagination from "WT/components/Layout/Pagination";
import { SessionUser } from "WT/types";
import DeleteConfirmModal from "WT/components/Layout/UserModal/DeleteConfirmModal";
import EditUserModal from "WT/components/Layout/UserModal/EditUserModal";
import ViewUserModal from "WT/components/Layout/UserModal/ViewUserModal";
import AddUserModal from "WT/components/Layout/UserModal/AddUserModal";
import Button from "WT/components/Ui/Button";

const ListUserPage = ({ user }: { user: SessionUser | null | undefined }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    users,
    loading,
    pagination,
    filters,
    setFilters,
    setCurrentPage,
    refreshData,
  } = useUsers();

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
    setFilters({ search: "", role: "" });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleView = (userData: User) => {
    setSelectedUser(userData);
    setViewModalOpen(true);
  };

  const handleEdit = (userData: User) => {
    setSelectedUser(userData);
    setEditModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    setUserToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setAddModalOpen(false);
    setSelectedUser(null);
    setUserToDelete(null);
  };

  const handleSuccess = () => {
    refreshData();
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <h5 className={styles.cardTitle}>Data Users</h5>
        {user && (user.role === "ADMIN" || user.role === "PRINCIPAL") && (
          <Button
            className={styles.btnAdd}
            onClick={() => setAddModalOpen(true)}
          >
            <i className="fas fa-plus"></i>
            Tambah User
          </Button>
        )}
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

      <UserTable
        users={users}
        loading={loading}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.limit}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        user={user}
      />

      {!loading && users.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}

      <ViewUserModal
        isOpen={viewModalOpen}
        onClose={handleModalClose}
        userData={selectedUser}
      />

      <EditUserModal
        isOpen={editModalOpen}
        onClose={handleModalClose}
        userData={selectedUser}
        onSuccess={handleSuccess}
      />

      <AddUserModal
        isOpen={addModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {userToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={handleModalClose}
          id={userToDelete.id}
          name={userToDelete.name}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ListUserPage;
