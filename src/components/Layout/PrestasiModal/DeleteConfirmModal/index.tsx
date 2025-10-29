"use client";

import BaseDeleteModal from "../../BaseModal/BaseDeleteModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  nama: string;
  onSuccess: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  id,
  nama,
  onSuccess,
}: DeleteConfirmModalProps) => {
  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      itemName={nama}
      itemType="prestasi"
      deleteEndpoint={`/api/prestasi/${id}`}
    />
  );
};

export default DeleteConfirmModal;
