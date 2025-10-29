"use client";

import { useEffect, useState } from "react";
import { Prestasi } from "WT/types/prestasi";
import styles from "./EditPrestasiModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import Modal from "WT/components/Ui/Modal";
import { FormInput } from "WT/components/Ui/Form/FormInput";
import { FormTextarea } from "WT/components/Ui/Form/FormTextarea";
import { FormSelect } from "WT/components/Ui/Form/FormSelect";
import PhotoUpload from "WT/components/Ui/Form/PhotoUpload";
import { usePhotoUpload } from "WT/hooks/usePhotoUpload";
import { useForm } from "WT/hooks/useForm";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestasi: Prestasi | null;
  onSuccess: () => void;
}

const EditModal = ({
  isOpen,
  onClose,
  prestasi,
  onSuccess,
}: EditModalProps) => {
  const [currentImagePath, setCurrentImagePath] = useState<string>("");

  const photoUpload = usePhotoUpload(
    "/api/upload/prestasi",
    "/api/upload/prestasi",
    prestasi?.image ?? undefined
  );

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      penyelenggara: "",
      recipient_type: "Siswa" as "Siswa" | "Sekolah" | "GTK",
      nama_penerima: "",
      level: "Provinsi" as "Provinsi" | "Nasional" | "Internasional",
      tanggal: "",
    },
    onSubmit: async (values) => {
      if (!prestasi || photoUpload.isUploading) {
        toast.warn("Mohon tunggu upload foto selesai");
        return;
      }

      const finalImagePath =
        currentImagePath || photoUpload.getFinalImagePath();

      const res = await fetch(`/api/prestasi/${prestasi.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          image: finalImagePath || undefined,
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
            `/api/upload/prestasi?path=${photoUpload.originalImagePath}`,
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
    if (prestasi) {
      const tanggalFormatted = prestasi.tanggal
        ? new Date(prestasi.tanggal).toISOString().split("T")[0]
        : "";

      form.setValues({
        name: prestasi.name,
        description: prestasi.description,
        penyelenggara: prestasi.penyelenggara,
        recipient_type: prestasi.recipient_type,
        nama_penerima: prestasi.nama_penerima,
        level: prestasi.level,
        tanggal: tanggalFormatted,
      });

      setCurrentImagePath(prestasi.image || "");
    }
  }, [prestasi]);

  const handleModalClose = async () => {
    await photoUpload.cleanup();
    setCurrentImagePath("");
    onClose();
  };

  if (!prestasi) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Edit Data Prestasi"
      size="large"
    >
      <form onSubmit={form.handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <FormInput
            label="Nama Prestasi"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            required
          />

          <FormInput
            label="Penyelenggara"
            name="penyelenggara"
            value={form.values.penyelenggara}
            onChange={form.handleChange}
            required
          />

          <FormSelect
            label="Penerima"
            name="recipient_type"
            value={form.values.recipient_type}
            onChange={form.handleChange}
            options={[
              { value: "Siswa", label: "Siswa" },
              { value: "Sekolah", label: "Sekolah" },
              { value: "GTK", label: "GTK" },
            ]}
            required
          />

          <FormInput
            label="Nama Penerima"
            name="nama_penerima"
            value={form.values.nama_penerima}
            onChange={form.handleChange}
            required
          />

          <FormSelect
            label="Tingkat"
            name="level"
            value={form.values.level}
            onChange={form.handleChange}
            options={[
              { value: "Provinsi", label: "Provinsi" },
              { value: "Nasional", label: "Nasional" },
              { value: "Internasional", label: "Internasional" },
            ]}
            required
          />

          <FormInput
            label="Tanggal"
            name="tanggal"
            type="date"
            value={form.values.tanggal}
            onChange={form.handleChange}
            max={new Date().toISOString().split("T")[0]}
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
          uploadEndpoint="/api/upload/prestasi"
          deleteEndpoint="/api/upload/prestasi"
          initialPhoto={prestasi.image ?? undefined}
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
