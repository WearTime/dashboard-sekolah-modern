import { ReactNode } from "react";
import Button from "WT/components/Ui/Button";
import styles from "./ConfirmationModal.module.css";
import Modal from "WT/components/Layout/Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: "danger" | "primary";
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  confirmButtonStyle = "danger",
  isLoading = false,
  size = "small",
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size={size}>
      <div className={styles.confirmationContent}>
        <div className={styles.messageContainer}>
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>

        <div className={styles.buttonContainer}>
          <Button
            type="button"
            className={styles.btnCancel}
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={`${styles.btnConfirm} ${
              confirmButtonStyle === "danger"
                ? styles.btnDanger
                : styles.btnPrimary
            }`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
