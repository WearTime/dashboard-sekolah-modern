"use client";

import { useEffect, useState } from "react";
import { Siswa } from "WT/types/student";
import Button from "WT/components/Ui/Button";
import { toast } from "react-toastify";
import styles from "./EditStudentModal.module.css";
import { FormInput } from "WT/components/Ui/Form/FormInput";
import { FormSelect } from "WT/components/Ui/Form/FormSelect";
import { FormTextarea } from "WT/components/Ui/Form/FormTextarea";
import PhotoUpload from "WT/components/Ui/Form/PhotoUpload";
import Modal from "WT/components/Ui/Modal";
import { usePhotoUpload } from "WT/hooks/usePhotoUpload";
import { useForm } from "WT/hooks/useForm";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Siswa | null;
  onSuccess: () => void;
}

const EditStudentModal = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}: EditStudentModalProps) => {
  const [currentImagePath, setCurrentImagePath] = useState<string>("");

  const photoUpload = usePhotoUpload(
    "/api/upload/siswa",
    "/api/upload/siswa",
    student?.image ?? undefined
  );

  const form = useForm({
    initialValues: {
      nama: "",
      kelas: "",
      jurusan: "",
      jenis_kelamin: "L" as "L" | "P",
      no_hp: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      alamat: "",
    },
    onSubmit: async (values) => {
      if (!student || photoUpload.isUploading) {
        toast.warn("Mohon tunggu upload foto selesai");
        return;
      }

      const finalImagePath =
        currentImagePath || photoUpload.getFinalImagePath();

      const res = await fetch(`/api/siswa/${student.nisn}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          image: finalImagePath || null,
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
            `/api/upload/siswa?path=${photoUpload.originalImagePath}`,
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
    if (student) {
      form.setValues({
        nama: student.nama,
        kelas: student.kelas,
        jurusan: student.jurusan,
        jenis_kelamin: student.jenis_kelamin,
        no_hp: student.no_hp || "",
        tempat_lahir: student.tempat_lahir || "",
        tanggal_lahir: student.tanggal_lahir
          ? new Date(student.tanggal_lahir).toISOString().split("T")[0]
          : "",
        alamat: student.alamat || "",
      });

      setCurrentImagePath(student.image || "");
    }
  }, [student]);

  const handleModalClose = async () => {
    await photoUpload.cleanup();
    setCurrentImagePath("");
    onClose();
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Edit Data Siswa"
      size="large"
    >
      <form onSubmit={form.handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <FormInput
            label="Nama Lengkap"
            name="nama"
            value={form.values.nama}
            onChange={form.handleChange}
            required
          />

          <FormInput label="NISN" value={student.nisn} disabled />

          <FormSelect
            label="Kelas"
            name="kelas"
            value={form.values.kelas}
            onChange={form.handleChange}
            required
            options={[
              { value: "", label: "Pilih Kelas" },
              { value: "X", label: "X" },
              { value: "XI", label: "XI" },
              { value: "XII", label: "XII" },
            ]}
          />

          <FormSelect
            label="Jurusan"
            name="jurusan"
            value={form.values.jurusan}
            onChange={form.handleChange}
            required
            options={[
              { value: "", label: "Pilih Jurusan" },
              { value: "PPLG", label: "Rekayasa Perangkat Lunak" },
              { value: "TKJT", label: "Teknik Komputer dan Jaringan" },
              { value: "MM", label: "Multimedia" },
              { value: "AKL", label: "Akuntansi dan Keuangan Lembaga" },
            ]}
          />

          <FormSelect
            label="Jenis Kelamin"
            name="jenis_kelamin"
            value={form.values.jenis_kelamin}
            onChange={form.handleChange}
            required
            options={[
              { value: "L", label: "Laki-laki" },
              { value: "P", label: "Perempuan" },
            ]}
          />

          <FormInput
            label="No. HP"
            type="tel"
            name="no_hp"
            value={form.values.no_hp}
            onChange={form.handleChange}
            placeholder="Contoh: 081234567890"
          />

          <FormInput
            label="Tempat Lahir"
            name="tempat_lahir"
            value={form.values.tempat_lahir}
            onChange={form.handleChange}
          />

          <FormInput
            label="Tanggal Lahir"
            type="date"
            name="tanggal_lahir"
            value={form.values.tanggal_lahir}
            onChange={form.handleChange}
          />
        </div>

        <FormTextarea
          label="Alamat"
          name="alamat"
          value={form.values.alamat}
          onChange={form.handleChange}
          rows={3}
        />

        <PhotoUpload
          label="Foto Siswa"
          uploadEndpoint="/api/upload/siswa"
          deleteEndpoint="/api/upload/siswa"
          initialPhoto={student.image ?? undefined}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPhotoChange={(path: any) => {
            setCurrentImagePath(path);
          }}
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

export default EditStudentModal;
