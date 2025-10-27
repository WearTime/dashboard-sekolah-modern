"use client";

import { Ekstrakulikuler } from "WT/types/ekstrakulikuler";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  eskul: Ekstrakulikuler | null;
}

const ViewModal = ({ isOpen, onClose, eskul }: ViewModalProps) => {
  if (!eskul) return null;

  const sections: InfoSection[] = [
    {
      title: "Informasi Ekstrakulikuler",
      items: [
        { label: "Nama Ekstrakulikuler", value: eskul.namaEskul },
        { label: "Pembina/Pendamping", value: eskul.pendamping },
        { label: "Ketua", value: eskul.ketua },
      ],
    },
  ];

  const descriptionSection = eskul.description ? (
    <div style={{ marginTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h6
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#26a7b8",
            margin: 0,
            paddingBottom: "0.5rem",
            borderBottom: "2px solid #26a7b8",
          }}
        >
          Deskripsi
        </h6>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            color: "#1f2937",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            textAlign: "justify",
          }}
        >
          {eskul.description}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Ekstrakulikuler"
      image={eskul.imagesThumbnail ?? undefined}
      imageAlt={eskul.namaEskul}
      sections={sections}
      extraContent={descriptionSection}
      imageStyle="rectangle"
    />
  );
};

export default ViewModal;
