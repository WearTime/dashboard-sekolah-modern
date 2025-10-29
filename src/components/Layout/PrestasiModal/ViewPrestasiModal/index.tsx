"use client";

import { Prestasi } from "WT/types/prestasi";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestasi: Prestasi | null;
}

const ViewModal = ({ isOpen, onClose, prestasi }: ViewModalProps) => {
  if (!prestasi) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const sections: InfoSection[] = [
    {
      title: "Informasi Prestasi",
      items: [
        { label: "Nama Prestasi", value: prestasi.name },
        { label: "Penyelenggara", value: prestasi.penyelenggara },
        { label: "Penerima", value: prestasi.recipient_type },
        { label: "Nama Penerima", value: prestasi.nama_penerima },
        { label: "Tingkat", value: prestasi.level },
        { label: "Tanggal", value: formatDate(prestasi.tanggal) },
      ],
    },
  ];

  const descriptionSection = prestasi.description ? (
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
          {prestasi.description}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Prestasi"
      image={prestasi.image ?? undefined}
      imageAlt={prestasi.name}
      sections={sections}
      extraContent={descriptionSection}
      imageStyle="rectangle"
    />
  );
};

export default ViewModal;
