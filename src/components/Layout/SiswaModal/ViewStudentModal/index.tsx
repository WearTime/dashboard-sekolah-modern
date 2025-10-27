"use client";

import { Siswa } from "WT/types/student";
import BaseViewModal, {
  InfoSection,
} from "WT/components/Layout/BaseModal/BaseViewModal";

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Siswa | null;
}

const ViewStudentModal = ({
  isOpen,
  onClose,
  student,
}: ViewStudentModalProps) => {
  if (!student) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const sections: InfoSection[] = [
    {
      title: "Informasi Pribadi",
      items: [
        { label: "Nama Lengkap", value: student.nama },
        { label: "NISN", value: student.nisn },
        {
          label: "Jenis Kelamin",
          value: student.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
        },
        { label: "Tempat Lahir", value: student.tempat_lahir || "-" },
        {
          label: "Tanggal Lahir",
          value: student.tanggal_lahir
            ? formatDate(student.tanggal_lahir)
            : "-",
        },
        { label: "No. HP", value: student.no_hp || "-" },
      ],
    },
    {
      title: "Informasi Akademik",
      items: [
        { label: "Kelas", value: student.kelas },
        { label: "Jurusan", value: student.jurusan },
      ],
    },
  ];

  const alamatSection = student.alamat ? (
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
          Alamat
        </h6>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            color: "#1f2937",
            lineHeight: 1.6,
          }}
        >
          {student.alamat}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Siswa"
      image={student.image ?? undefined}
      imageAlt={student.nama}
      sections={sections}
      extraContent={alamatSection}
    />
  );
};

export default ViewStudentModal;
