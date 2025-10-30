"use client";

import { ProgramSekolah } from "WT/types/program";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ProgramSekolah | null;
}

const ViewModal = ({ isOpen, onClose, program }: ViewModalProps) => {
  if (!program) return null;

  const sections: InfoSection[] = [
    {
      title: "Informasi Program",
      items: [
        { label: "Judul Program", value: program.judul },
        { label: "Tipe Program", value: program.tipe_program },
      ],
    },
  ];

  const descriptionSection = program.deskripsi ? (
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
          {program.deskripsi}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Program"
      image={program.thumbnail ?? undefined}
      imageAlt={program.judul}
      sections={sections}
      extraContent={descriptionSection}
      imageStyle="rectangle"
    />
  );
};

export default ViewModal;
