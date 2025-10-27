"use client";

import BaseDeleteModal from "../../BaseModal/BaseDeleteModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  nisn: string;
  nama: string;
  onSuccess: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  nisn,
  nama,
  onSuccess,
}: DeleteConfirmModalProps) => {
  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      itemName={nama}
      itemType="siswa"
      deleteEndpoint={`/api/siswa/${nisn}`}
    />
  );
};

export default DeleteConfirmModal;
