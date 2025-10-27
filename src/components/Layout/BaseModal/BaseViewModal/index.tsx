"use client";

import Button from "WT/components/Ui/Button";
import styles from "./BaseViewModal.module.css";
import Modal from "WT/components/Ui/Modal";

export interface InfoSection {
  title: string;
  items: Array<{
    label: string;
    value: string | React.ReactNode;
  }>;
}

interface BaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  imageAlt?: string;
  sections: InfoSection[];
  extraContent?: React.ReactNode;
  imageStyle?: "circle" | "rectangle";
}

const BaseViewModal = ({
  isOpen,
  onClose,
  title,
  image,
  imageAlt = "Image",
  sections,
  extraContent,
  imageStyle = "circle",
}: BaseViewModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="large">
      <div className={styles.detailContainer}>
        <div className={styles.imageSection}>
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className={
                imageStyle === "rectangle"
                  ? styles.itemImageRectangle
                  : styles.itemImage
              }
            />
          ) : (
            <div
              className={
                imageStyle === "rectangle"
                  ? styles.noImageRectangle
                  : styles.noImage
              }
            >
              <i
                className={
                  imageStyle === "rectangle" ? "fas fa-image" : "fas fa-user"
                }
              ></i>
              {imageStyle === "rectangle" && <p>Tidak ada gambar</p>}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className={styles.infoGroup}>
              <h6 className={styles.infoLabel}>{section.title}</h6>
              <div className={styles.infoGrid}>
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={styles.infoItem}>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.value}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {extraContent}
        </div>

        <div className={styles.modalActions}>
          <Button className={styles.btnClose} onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BaseViewModal;
