"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "WT/components/Ui/Modal";
import styles from "./EditUserModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import { useUsers } from "WT/hooks/useUsers";
import { User, UserWithPermissions } from "WT/types/user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: User | null;
  onSuccess: () => void;
}

const EditUserModal = ({
  isOpen,
  onClose,
  userData,
  onSuccess,
}: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEACHER" as "ADMIN" | "TEACHER" | "PRINCIPAL",
    selectedPermissions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] =
    useState(false);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    permissions,
    loadingPermissions,
    fetchPermissions,
    rolePermissions,
    fetchRolePermissions,
  } = useUsers();

  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
      fetchRolePermissions();
    }
  }, [isOpen, fetchPermissions, fetchRolePermissions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPermissionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (userData && isOpen) {
      setLoadingDetails(true);
      fetch(`/api/users/${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const userDetails: UserWithPermissions = data.data;
            setFormData({
              name: userDetails.name,
              email: userDetails.email,
              password: "",
              role: userDetails.role,
              selectedPermissions: userDetails.userPermissions.map(
                (up) => up.permissionId
              ),
            });
          }
        })
        .finally(() => setLoadingDetails(false));
    }
  }, [userData, isOpen]);

  useEffect(() => {
    if (
      formData.role &&
      rolePermissions[formData.role] &&
      !loadingDetails &&
      formData.selectedPermissions.length === 0
    ) {
      const rolePerms = rolePermissions[formData.role];
      const matchingPermissionIds = permissions
        .filter((p) => rolePerms.includes(p.name))
        .map((p) => p.id);
      setFormData((prev) => ({
        ...prev,
        selectedPermissions: matchingPermissionIds,
      }));
    }
  }, [
    formData.role,
    rolePermissions,
    permissions,
    loadingDetails,
    formData.selectedPermissions.length,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter((id) => id !== permissionId)
        : [...prev.selectedPermissions, permissionId],
    }));
  };

  const handleRemovePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.filter(
        (id) => id !== permissionId
      ),
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const filteredGroupedPermissions = Object.entries(groupedPermissions).reduce(
    (acc, [resource, perms]) => {
      const filtered = perms.filter(
        (p) =>
          p.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
          p.description
            ?.toLowerCase()
            .includes(permissionSearchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[resource] = filtered;
      }
      return acc;
    },
    {} as Record<string, typeof permissions>
  );

  const getSelectedPermissionNames = () => {
    return permissions
      .filter((p) => formData.selectedPermissions.includes(p.id))
      .map((p) => p.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          permissions: formData.selectedPermissions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User berhasil diperbarui!");
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Gagal memperbarui user");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat memperbarui user");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="large">
      {loadingDetails ? (
        <div className={styles.loadingContainer}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Memuat data user...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nama Lengkap <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="contoh@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Kosongkan jika tidak ingin mengubah"
                minLength={6}
              />
              <span className={styles.hint}>
                Minimal 6 karakter. Kosongkan jika tidak ingin mengubah.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>
                Role <span className={styles.required}>*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="TEACHER">Teacher</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Permissions</label>
            {loadingPermissions ? (
              <div className={styles.loadingPermissions}>
                <i className="fas fa-spinner fa-spin"></i> Memuat permissions...
              </div>
            ) : (
              <div className={styles.multiSelectWrapper} ref={dropdownRef}>
                <div
                  className={styles.multiSelectInput}
                  onClick={() =>
                    setIsPermissionDropdownOpen(!isPermissionDropdownOpen)
                  }
                >
                  {formData.selectedPermissions.length === 0 ? (
                    <span className={styles.placeholder}>
                      Pilih permissions (auto-selected based on role)
                    </span>
                  ) : (
                    <div className={styles.selectedTags}>
                      {getSelectedPermissionNames()
                        .slice(0, 3)
                        .map((name, idx) => (
                          <span key={idx} className={styles.tag}>
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const permId =
                                  formData.selectedPermissions[idx];
                                if (permId) {
                                  handleRemovePermission(permId);
                                }
                              }}
                              className={styles.tagRemove}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      {formData.selectedPermissions.length > 3 && (
                        <span className={styles.tag}>
                          +{formData.selectedPermissions.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <i
                    className={`fas fa-chevron-down ${styles.dropdownIcon}`}
                  ></i>
                </div>

                {isPermissionDropdownOpen && (
                  <div className={styles.multiSelectDropdown}>
                    <div className={styles.dropdownSearch}>
                      <input
                        type="text"
                        placeholder="Cari permission..."
                        value={permissionSearchTerm}
                        onChange={(e) =>
                          setPermissionSearchTerm(e.target.value)
                        }
                        className={styles.searchInput}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className={styles.dropdownList}>
                      {Object.keys(filteredGroupedPermissions).length === 0 ? (
                        <div className={styles.noResults}>
                          {permissionSearchTerm
                            ? "Tidak ada hasil"
                            : "Belum ada permissions"}
                        </div>
                      ) : (
                        Object.entries(filteredGroupedPermissions).map(
                          ([resource, perms]) => (
                            <div
                              key={resource}
                              className={styles.permissionGroup}
                            >
                              <div className={styles.groupHeader}>
                                {resource}
                              </div>
                              {perms.map((permission) => (
                                <label
                                  key={permission.id}
                                  className={styles.dropdownItem}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.selectedPermissions.includes(
                                      permission.id
                                    )}
                                    onChange={() =>
                                      handlePermissionToggle(permission.id)
                                    }
                                    className={styles.checkbox}
                                  />
                                  <div className={styles.permissionInfo}>
                                    <span className={styles.permissionName}>
                                      {permission.name}
                                    </span>
                                    {permission.description && (
                                      <span className={styles.permissionDesc}>
                                        {permission.description}
                                      </span>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <Button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Menyimpan...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditUserModal;
