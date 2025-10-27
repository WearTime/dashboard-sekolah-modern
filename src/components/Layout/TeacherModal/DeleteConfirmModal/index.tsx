"use client";
import BaseDeleteModal from "../../BaseModal/BaseDeleteModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  nip: string;
  nama: string;
  onSuccess: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  nip,
  nama,
  onSuccess,
}: DeleteConfirmModalProps) => {
  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      itemName={nama}
      itemType="guru"
      deleteEndpoint={`/api/guru/${nip}`}
    />
  );
};

export default DeleteConfirmModal;
