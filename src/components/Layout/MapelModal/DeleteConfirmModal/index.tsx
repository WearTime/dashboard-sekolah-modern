"use client";

import { useState } from "react";
import Modal from "WT/components/Layout/Modal";
import styles from "./DeleteConfirmModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  kode_mapel: string;
  nama_mapel: string;
  onSuccess: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  kode_mapel,
  nama_mapel,
  onSuccess,
}: DeleteConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mapel/${kode_mapel}`, {
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
      toast.error("Gagal menghapus data mata pelajaran");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus"
      size="small"
    >
      <div className={styles.content}>
        <div className={styles.iconWarning}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <div className={styles.message}>
          <p className={styles.messageText}>
            Apakah Anda yakin ingin menghapus mata pelajaran ini?
          </p>
          <p className={styles.studentName}>{nama_mapel}</p>
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

export default DeleteConfirmModal;
