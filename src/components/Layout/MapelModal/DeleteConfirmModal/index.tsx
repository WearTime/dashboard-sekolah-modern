"use client";

import BaseDeleteModal from "../../BaseModal/BaseDeleteModal";

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
  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      itemName={nama_mapel}
      itemType="guru"
      deleteEndpoint={`/api/mapel/${kode_mapel}`}
    />
  );
};

export default DeleteConfirmModal;
