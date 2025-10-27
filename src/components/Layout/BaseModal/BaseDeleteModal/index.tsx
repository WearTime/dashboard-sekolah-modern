"use client";

import { useState } from "react";
import Button from "WT/components/Ui/Button";
import styles from "./BaseDeleteModal.module.css";
import { toast } from "react-toastify";
import Modal from "WT/components/Ui/Modal";

interface BaseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  itemName: string;
  itemType: string;
  deleteEndpoint: string;
  confirmMessage?: string;
}

const BaseDeleteModal = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Konfirmasi Hapus",
  itemName,
  itemType,
  deleteEndpoint,
  confirmMessage = `Apakah Anda yakin ingin menghapus data ${itemType}?`,
}: BaseDeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(deleteEndpoint, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(`Gagal menghapus data ${itemType}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className={styles.content}>
        <div className={styles.iconWarning}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <div className={styles.message}>
          <p className={styles.messageText}>{confirmMessage}</p>
          <p className={styles.itemName}>{itemName}</p>
          <p className={styles.warningText}>
            <i className="fas fa-info-circle"></i>
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>

        <div className={styles.modalActions}>
          <Button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            className={styles.btnDelete}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Menghapus...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i> Hapus
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BaseDeleteModal;
