"use client";

import { useEffect, useState } from "react";
import { ProgramSekolah, TipeProgram } from "WT/types/program";
import styles from "./EditProgramModal.module.css";
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
  program: ProgramSekolah | null;
  onSuccess: () => void;
}

const EditModal = ({ isOpen, onClose, program, onSuccess }: EditModalProps) => {
  const [currentImagePath, setCurrentImagePath] = useState<string>("");

  const photoUpload = usePhotoUpload(
    "/api/upload/program",
    "/api/upload/program",
    program?.thumbnail ?? undefined
  );

  const form = useForm({
    initialValues: {
      judul: "",
      deskripsi: "",
      tipe_program: "Kurikulum" as TipeProgram,
    },
    onSubmit: async (values) => {
      if (!program || photoUpload.isUploading) {
        toast.warn("Mohon tunggu upload foto selesai");
        return;
      }

      const finalImagePath =
        currentImagePath || photoUpload.getFinalImagePath();

      const res = await fetch(`/api/program/${program.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          thumbnail: finalImagePath || undefined,
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
            `/api/upload/program?path=${photoUpload.originalImagePath}`,
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
    if (program) {
      form.setValues({
        judul: program.judul,
        deskripsi: program.deskripsi,
        tipe_program: program.tipe_program,
      });

      setCurrentImagePath(program.thumbnail || "");
    }
  }, [program]);

  const handleModalClose = async () => {
    await photoUpload.cleanup();
    setCurrentImagePath("");
    onClose();
  };

  if (!program) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Edit Data Program"
      size="large"
    >
      <form onSubmit={form.handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <FormInput
            label="Judul Program"
            name="judul"
            value={form.values.judul}
            onChange={form.handleChange}
            required
          />

          <FormTextarea
            label="Deskripsi"
            name="deskripsi"
            value={form.values.deskripsi}
            onChange={form.handleChange}
            required
            rows={6}
          />
        </div>

        <PhotoUpload
          label="Thumbnail"
          uploadEndpoint="/api/upload/program"
          deleteEndpoint="/api/upload/program"
          initialPhoto={program.thumbnail ?? undefined}
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
