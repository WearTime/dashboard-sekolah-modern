"use client";

import BaseDeleteModal from "../../BaseModal/BaseDeleteModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  judul: string;
  onSuccess: () => void;
}

const DeleteProgramJurusanModal = ({
  isOpen,
  onClose,
  id,
  judul,
  onSuccess,
}: DeleteConfirmModalProps) => {
  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      itemName={judul}
      itemType="program jurusan"
      deleteEndpoint={`/api/program-jurusan/${id}`}
    />
  );
};

export default DeleteProgramJurusanModal;
