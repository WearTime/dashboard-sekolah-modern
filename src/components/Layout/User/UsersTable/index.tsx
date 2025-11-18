"use client";

import { User } from "WT/types/user";
import styles from "./UsersTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ProtectedActionButtons from "WT/components/Ui/ProtectedActionButtons";

interface UserTableProps {
  users: User[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: number, name: string) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  user: SessionUser | null | undefined;
}

const UserTable = ({
  users,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    const baseClass = styles.roleBadge;
    switch (role) {
      case "ADMIN":
        return `${baseClass} ${styles.roleAdmin}`;
      case "PRINCIPAL":
        return `${baseClass} ${styles.rolePrincipal}`;
      case "TEACHER":
        return `${baseClass} ${styles.roleTeacher}`;
      default:
        return baseClass;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: "Admin",
      PRINCIPAL: "Kepala Sekolah",
      TEACHER: "Guru",
    };
    return labels[role] || role;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat Pada</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
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

  if (users.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat Pada</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox"></i>
                  <p>Tidak ada data users</p>
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
            <th>Email</th>
            <th>Role</th>
            <th>Dibuat Pada</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userData, idx) => (
            <tr key={userData.id} onClick={() => onView(userData)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>
                <div className={styles.userDetails}>
                  <h6>{userData.name}</h6>
                </div>
              </td>
              <td>{userData.email}</td>
              <td>
                <span className={getRoleBadge(userData.role)}>
                  {getRoleLabel(userData.role)}
                </span>
              </td>
              <td>{formatDate(userData.createdAt)}</td>
              <td>
                <ProtectedActionButtons
                  user={user}
                  actions={[
                    {
                      icon: "fas fa-eye",
                      title: "Lihat Detail",
                      onClick: (e) => {
                        e.stopPropagation();
                        onView(userData);
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
                        onEdit(userData);
                      },
                      permission: "guru.edit",
                      variant: "edit",
                    },
                    {
                      icon: "fas fa-trash",
                      title: "Hapus",
                      onClick: (e) => {
                        e.stopPropagation();
                        onDelete(userData.id, userData.name);
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

export default UserTable;
