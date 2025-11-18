"use client";

import { User, UserWithPermissions } from "WT/types/user";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";
import { useEffect, useState } from "react";
import styles from "./ViewUserModal.module.css";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: User | null;
}

const ViewUserModal = ({ isOpen, onClose, userData }: ViewUserModalProps) => {
  const [userDetails, setUserDetails] = useState<UserWithPermissions | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && isOpen) {
      setLoading(true);
      fetch(`/api/users/${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserDetails(data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [userData, isOpen]);

  if (!userData) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: "Admin",
      PRINCIPAL: "Kepala Sekolah",
      TEACHER: "Guru",
    };
    return labels[role] || role;
  };

  const sections: InfoSection[] = [
    {
      title: "Informasi Akun",
      items: [
        { label: "Nama Lengkap", value: userData.name },
        { label: "Email", value: userData.email },
        { label: "Role", value: getRoleLabel(userData.role) },
        { label: "Dibuat Pada", value: formatDate(userData.createdAt) },
      ],
    },
  ];

  const permissionsSection = userDetails && (
    <div className={styles.infoGroup}>
      <h6 className={styles.infoLabel}>
        Permissions
        {loading && (
          <i
            className="fas fa-spinner fa-spin"
            style={{ marginLeft: "8px", fontSize: "14px" }}
          ></i>
        )}
      </h6>
      {loading ? (
        <div className={styles.loadingPermissions}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Memuat permissions...</span>
        </div>
      ) : userDetails.userPermissions.length > 0 ? (
        <div className={styles.permissionsList}>
          {userDetails.userPermissions.map((up) => (
            <div key={up.id} className={styles.permissionCard}>
              <div className={styles.permissionName}>{up.permission.name}</div>
              {up.permission.description && (
                <div className={styles.permissionDesc}>
                  {up.permission.description}
                </div>
              )}
              <div className={styles.permissionMeta}>
                <span className={styles.permissionResource}>
                  {up.permission.resource}
                </span>
                <span className={styles.permissionAction}>
                  {up.permission.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noPermissions}>
          <i className="fas fa-info-circle"></i>
          <span>Tidak ada custom permissions</span>
        </div>
      )}
    </div>
  );

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail User"
      sections={sections}
      extraContent={permissionsSection}
    />
  );
};

export default ViewUserModal;
