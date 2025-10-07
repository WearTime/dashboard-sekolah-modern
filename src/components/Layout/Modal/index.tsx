import { ReactNode } from "react";
import styles from "./Modal.module.css";
import Button from "WT/components/Ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "small" | "medium" | "large";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}: ModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={`${styles.modalContent} ${styles[size]}`}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>{title}</h5>
          <Button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
