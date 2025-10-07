"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./StudentAdd.module.css";
import Button from "WT/components/Ui/Button";
import { useUnsavedChanges } from "WT/hooks/useUnsavedChanges";
import ConfirmationModal from "WT/components/Layout/ConfirmationModal";

interface StudentFormData {
  nisn: string;
  nama: string;
  kelas: string;
  jurusan: string;
  no_hp: string;
  jenis_kelamin: "L" | "P";
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  image?: string;
}

const initialFormData: StudentFormData = {
  nisn: "",
  nama: "",
  kelas: "",
  jurusan: "",
  no_hp: "",
  jenis_kelamin: "L",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat: "",
};

export default function TambahSiswa() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [hasChanges, setHasChanges] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNavigateModal, setShowNavigateModal] = useState(false);
  const [pendingNavigationResolve, setPendingNavigationResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  useEffect(() => {
    const isModified =
      formData.nisn !== "" ||
      formData.nama !== "" ||
      formData.kelas !== "" ||
      formData.jurusan !== "" ||
      formData.no_hp !== "" ||
      formData.tempat_lahir !== "" ||
      formData.tanggal_lahir !== "" ||
      formData.alamat !== "" ||
      uploadedImagePath !== "";

    setHasChanges(isModified);
  }, [formData, uploadedImagePath]);

  const handleNavigationPrompt = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setShowNavigateModal(true);
      setPendingNavigationResolve(() => resolve);
    });
  };

  const handleNavigationConfirm = async () => {
    setShowNavigateModal(false);
    if (uploadedImagePath) {
      try {
        await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
    if (pendingNavigationResolve) {
      pendingNavigationResolve(true);
      setPendingNavigationResolve(null);
    }
  };

  const handleNavigationCancel = () => {
    setShowNavigateModal(false);
    if (pendingNavigationResolve) {
      pendingNavigationResolve(false);
      setPendingNavigationResolve(null);
    }
  };

  useUnsavedChanges({
    hasUnsavedChanges: hasChanges,
    onNavigateAway: handleNavigationPrompt,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setPhotoPreview("");
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
      setPhotoPreview("");
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (uploadedImagePath) {
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
    const input = document.getElementById("photoInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploading) {
      toast.warn("Mohon tunggu upload foto selesai");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        image: uploadedImagePath || undefined,
      };

      const response = await fetch("/api/siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Data siswa berhasil disimpan!");
        setHasChanges(false);
        router.push("/siswa");
      } else {
        toast.error(result.message || "Gagal menyimpan data siswa");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (hasChanges) {
      setShowCancelModal(true);
    } else {
      router.push("/siswa");
    }
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    if (uploadedImagePath) {
      try {
        await fetch(`/api/upload/siswa?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
    setHasChanges(false);
    router.push("/siswa");
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  return (
    <>
      <div className={styles.contentArea}>
        <div className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <h5 className={styles.cardTitle}>Form Tambah Siswa Baru</h5>
            <a href="#" className={styles.importBtn}>
              <span>Import</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className={styles.studentForm}>
            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Data Pribadi</div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Nama Lengkap<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    NISN<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleInputChange}
                    placeholder="Masukkan NISN"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Tempat Lahir<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleInputChange}
                    placeholder="Masukkan tempat lahir"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    Tanggal Lahir<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Jenis Kelamin<span className={styles.required}>*</span>
                  </label>
                  <div className={styles.radioGroup}>
                    <div className={styles.radioOption}>
                      <input
                        type="radio"
                        id="lakiLaki"
                        name="jenis_kelamin"
                        value="L"
                        checked={formData.jenis_kelamin === "L"}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="lakiLaki">Laki-laki</label>
                    </div>
                    <div className={styles.radioOption}>
                      <input
                        type="radio"
                        id="perempuan"
                        name="jenis_kelamin"
                        value="P"
                        checked={formData.jenis_kelamin === "P"}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="perempuan">Perempuan</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Data Akademik</div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Kelas<span className={styles.required}>*</span>
                  </label>
                  <select
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    Jurusan<span className={styles.required}>*</span>
                  </label>
                  <select
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Jurusan</option>
                    <option value="PPLG">Rekayasa Perangkat Lunak</option>
                    <option value="TKJT">Teknik Komputer dan Jaringan</option>
                    <option value="DKV">Desain Komunikasi Visual</option>
                    <option value="AKL">Akuntansi dan Keuangan Lembaga</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Informasi Kontak</div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    No. HP/WhatsApp<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>
                    Alamat Lengkap<span className={styles.required}>*</span>
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Foto Siswa</div>

              <div
                className={`${styles.photoUpload} ${
                  photoPreview ? styles.active : ""
                }`}
                onClick={() =>
                  !isUploading && document.getElementById("photoInput")?.click()
                }
              >
                {photoPreview && (
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
                  </div>
                )}
                {!photoPreview && (
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
                        : "Klik untuk upload foto atau drag & drop"}
                    </div>
                    <div className={styles.photoUploadHint}>
                      Format: JPG, PNG, WEBP (Maks. 1MB)
                    </div>
                  </>
                )}
                <input
                  type="file"
                  id="photoInput"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                className={styles.btnCancel}
                onClick={handleCancelClick}
                disabled={isLoading || isUploading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className={styles.btnSubmit}
                disabled={isLoading || isUploading}
              >
                <i className="fas fa-save"></i>
                {isLoading ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        title="Konfirmasi Pembatalan"
        message="Apakah Anda yakin ingin membatalkan? Semua data yang sudah diisi akan hilang."
        confirmText="Ya, Batalkan"
        cancelText="Tidak"
        confirmButtonStyle="danger"
      />

      {/* Navigation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showNavigateModal}
        onClose={handleNavigationCancel}
        onConfirm={handleNavigationConfirm}
        title="Perubahan Belum Disimpan"
        message={
          <div>
            <p>Anda memiliki perubahan yang belum disimpan.</p>
            <p>Apakah Anda yakin ingin meninggalkan halaman ini?</p>
          </div>
        }
        confirmText="Ya, Tinggalkan"
        cancelText="Tetap di Halaman"
        confirmButtonStyle="danger"
      />
    </>
  );
}
