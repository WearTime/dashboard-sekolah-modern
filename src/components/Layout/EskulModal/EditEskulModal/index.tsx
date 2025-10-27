"use client";

import { useEffect, useState } from "react";
import { Ekstrakulikuler } from "WT/types/ekstrakulikuler";
import styles from "./EditEskulModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import Modal from "WT/components/Ui/Modal";
import { FormInput } from "WT/components/Ui/Form/FormInput";
import { FormTextarea } from "WT/components/Ui/Form/FormTextarea";
import PhotoUpload from "WT/components/Ui/Form/PhotoUpload";
import { usePhotoUpload } from "WT/hooks/usePhotoUpload";
import { useForm } from "WT/hooks/useForm";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  eskul: Ekstrakulikuler | null;
  onSuccess: () => void;
}

const EditModal = ({ isOpen, onClose, eskul, onSuccess }: EditModalProps) => {
  const [currentImagePath, setCurrentImagePath] = useState<string>("");

  const photoUpload = usePhotoUpload(
    "/api/upload/ekstrakulikuler",
    "/api/upload/ekstrakulikuler",
    eskul?.imagesThumbnail ?? undefined
  );

  const form = useForm({
    initialValues: {
      namaEskul: "",
      pendamping: "",
      ketua: "",
      description: "",
    },
    onSubmit: async (values) => {
      if (!eskul || photoUpload.isUploading) {
        toast.warn("Mohon tunggu upload foto selesai");
        return;
      }

      const finalImagePath =
        currentImagePath || photoUpload.getFinalImagePath();

      const res = await fetch(`/api/ekstrakulikuler/${eskul.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          imagesThumbnail: finalImagePath || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (
          photoUpload.originalImagePath &&
          photoUpload.originalImagePath !== finalImagePath &&
          finalImagePath !== ""
        ) {
          await fetch(
            `/api/upload/ekstrakulikuler?path=${photoUpload.originalImagePath}`,
            { method: "DELETE" }
          ).catch(console.error);
        }

        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
        await photoUpload.cleanup();
        throw new Error(data.message);
      }
    },
  });

  useEffect(() => {
    if (eskul) {
      form.setValues({
        namaEskul: eskul.namaEskul,
        pendamping: eskul.pendamping,
        ketua: eskul.ketua,
        description: eskul.description,
      });

      setCurrentImagePath(eskul.imagesThumbnail || "");
    }
  }, [eskul]);

  const handleModalClose = async () => {
    await photoUpload.cleanup();
    setCurrentImagePath("");
    onClose();
  };

  if (!eskul) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Edit Data Ekstrakulikuler"
      size="large"
    >
      <form onSubmit={form.handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <FormInput
            label="Nama Ekstrakulikuler"
            name="namaEskul"
            value={form.values.namaEskul}
            onChange={form.handleChange}
            required
          />

          <FormInput
            label="Pembina/Pendamping"
            name="pendamping"
            value={form.values.pendamping}
            onChange={form.handleChange}
            required
          />

          <FormInput
            label="Ketua"
            name="ketua"
            value={form.values.ketua}
            onChange={form.handleChange}
            required
          />
        </div>

        <FormTextarea
          label="Deskripsi"
          name="description"
          value={form.values.description}
          onChange={form.handleChange}
          required
          rows={4}
        />

        <PhotoUpload
          label="Thumbnail"
          uploadEndpoint="/api/upload/ekstrakulikuler"
          deleteEndpoint="/api/upload/ekstrakulikuler"
          initialPhoto={eskul.imagesThumbnail ?? undefined}
          onPhotoChange={(path: string) => {
            setCurrentImagePath(path);
          }}
          maxSize={5}
        />

        <div className={styles.modalActions}>
          <Button
            type="button"
            className={styles.btnCancel}
            onClick={handleModalClose}
            disabled={form.loading || photoUpload.isUploading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className={styles.btnSubmit}
            disabled={form.loading || photoUpload.isUploading}
          >
            {form.loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Menyimpan...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Simpan
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditModal;
