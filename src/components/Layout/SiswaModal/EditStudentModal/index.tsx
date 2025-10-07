"use client";

import { useState, useEffect } from "react";
import { Siswa } from "WT/types/student";
import Modal from "WT/components/Layout/Modal";
import styles from "./EditStudentModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";

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
  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    jurusan: "",
    jenis_kelamin: "L" as "L" | "P",
    no_hp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [originalImagePath, setOriginalImagePath] = useState<string>("");

  useEffect(() => {
    if (student) {
      const imagePath = student.image || "";
      setFormData({
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
        image: imagePath,
      });
      setOriginalImagePath(imagePath);
      setPhotoPreview(imagePath);
      setUploadedImagePath("");
    }
  }, [student]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 1MB");
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak diizinkan! Hanya JPG, PNG, dan WEBP");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    const uploadToast = toast.loading("Mengupload foto...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/siswa", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
          try {
            await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.error("Error deleting old uploaded photo:", error);
          }
        }

        setUploadedImagePath(result.data.path);
        toast.update(uploadToast, {
          render: "Foto berhasil diupload!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(uploadToast, {
          render: result.message || "Gagal mengupload foto",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        setPhotoPreview(originalImagePath);
        e.target.value = "";
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.update(uploadToast, {
        render: "Terjadi kesalahan saat mengupload foto",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      setPhotoPreview(originalImagePath);
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
      try {
        await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }

    setPhotoPreview("");
    setUploadedImagePath("");
    const input = document.getElementById("photoEditInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) return;

    if (isUploading) {
      toast.warn("Mohon tunggu upload foto selesai");
      return;
    }

    setLoading(true);
    try {
      let finalImagePath = "";
      if (uploadedImagePath) {
        finalImagePath = uploadedImagePath;
      } else if (photoPreview) {
        finalImagePath = originalImagePath;
      }

      const submitData = {
        ...formData,
        image: finalImagePath || undefined,
      };

      const res = await fetch(`/api/siswa/${student.nisn}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (data.success) {
        if (originalImagePath && originalImagePath !== finalImagePath) {
          try {
            await fetch(`/api/upload/siswa?path=${originalImagePath}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.error("Error deleting old photo:", error);
          }
        }

        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);

        if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
          try {
            await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.error("Error deleting uploaded photo:", error);
          }
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengupdate data");
      console.error(error);
      if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
        try {
          await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Error deleting uploaded photo:", error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = async () => {
    if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
      try {
        await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting uploaded photo:", error);
      }
    }
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="nama" className={styles.label}>
              Nama Lengkap <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nisn" className={styles.label}>
              NISN
            </label>
            <input
              type="text"
              id="nisn"
              value={student.nisn}
              className={styles.input}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="kelas" className={styles.label}>
              Kelas <span className={styles.required}>*</span>
            </label>
            <select
              id="kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Pilih Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="jurusan" className={styles.label}>
              Jurusan <span className={styles.required}>*</span>
            </label>
            <select
              id="jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Pilih Jurusan</option>
              <option value="PPLG">Rekayasa Perangkat Lunak</option>
              <option value="TKJT">Teknik Komputer dan Jaringan</option>
              <option value="MM">Multimedia</option>
              <option value="AKL">Akuntansi dan Keuangan Lembaga</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="jenis_kelamin" className={styles.label}>
              Jenis Kelamin <span className={styles.required}>*</span>
            </label>
            <select
              id="jenis_kelamin"
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="no_hp" className={styles.label}>
              No. HP
            </label>
            <input
              type="tel"
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className={styles.input}
              placeholder="Contoh: 081234567890"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tempat_lahir" className={styles.label}>
              Tempat Lahir
            </label>
            <input
              type="text"
              id="tempat_lahir"
              name="tempat_lahir"
              value={formData.tempat_lahir}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tanggal_lahir" className={styles.label}>
              Tanggal Lahir
            </label>
            <input
              type="date"
              id="tanggal_lahir"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="alamat" className={styles.label}>
            Alamat
          </label>
          <textarea
            id="alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Foto Siswa</label>
          <div
            className={`${styles.photoUpload} ${
              photoPreview ? styles.active : ""
            }`}
            onClick={() =>
              !isUploading && document.getElementById("photoEditInput")?.click()
            }
          >
            {photoPreview ? (
              <div className={styles.photoPreview}>
                <img src={photoPreview} alt="Preview" />
                <Button
                  type="button"
                  className={styles.removePhotoBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto();
                  }}
                  disabled={isUploading}
                >
                  <i className="fas fa-times"></i>
                </Button>
                <div className={styles.changePhotoText}>
                  Klik untuk mengganti foto
                </div>
              </div>
            ) : (
              <>
                <div className={styles.photoUploadIcon}>
                  <i
                    className={
                      isUploading
                        ? "fas fa-spinner fa-spin"
                        : "fas fa-cloud-upload-alt"
                    }
                  ></i>
                </div>
                <div className={styles.photoUploadText}>
                  {isUploading
                    ? "Mengupload foto..."
                    : "Klik untuk upload foto"}
                </div>
                <div className={styles.photoUploadHint}>
                  Format: JPG, PNG, WEBP (Maks. 1MB)
                </div>
              </>
            )}
            <input
              type="file"
              id="photoEditInput"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            type="button"
            className={styles.btnCancel}
            onClick={handleModalClose}
            disabled={loading || isUploading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className={styles.btnSubmit}
            disabled={loading || isUploading}
          >
            {loading ? (
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
