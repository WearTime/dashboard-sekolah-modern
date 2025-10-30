"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./ProgramAdd.module.css";
import Button from "WT/components/Ui/Button";
import { useUnsavedChanges } from "WT/hooks/useUnsavedChanges";
import ConfirmationModal from "WT/components/Layout/ConfirmationModal";
import { TipeProgram } from "WT/types/program";

interface ProgramFormData {
  judul: string;
  deskripsi: string;
  tipe_program: TipeProgram;
  thumbnail?: string;
}

interface TambahProgramProps {
  tipeProgram: TipeProgram;
}

export default function TambahProgram({ tipeProgram }: TambahProgramProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [formData, setFormData] = useState<ProgramFormData>({
    judul: "",
    deskripsi: "",
    tipe_program: tipeProgram,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNavigateModal, setShowNavigateModal] = useState(false);
  const [pendingNavigationResolve, setPendingNavigationResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  useEffect(() => {
    const isModified =
      formData.judul !== "" ||
      formData.deskripsi !== "" ||
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
        await fetch(`/api/upload/program?path=${uploadedImagePath}`, {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 1000) {
      toast.error("Ukuran file terlalu kecil! Minimal 1KB");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 5MB");
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

      const response = await fetch("/api/upload/program", {
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
        await fetch(`/api/upload/program?path=${uploadedImagePath}`, {
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
        thumbnail: uploadedImagePath || undefined,
      };

      const response = await fetch("/api/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Data program berhasil disimpan!");
        setHasChanges(false);
        const route = `/program/${tipeProgram.toLowerCase()}`;
        router.push(route);
      } else {
        toast.error(result.message || "Gagal menyimpan data program");
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
      router.push(`/program/${tipeProgram.toLowerCase()}`);
    }
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    if (uploadedImagePath) {
      try {
        await fetch(`/api/upload/program?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
    setHasChanges(false);
    router.push(`/program/${tipeProgram.toLowerCase()}`);
  };

  return (
    <>
      <div className={styles.contentArea}>
        <div className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <h5 className={styles.cardTitle}>
              Form Tambah Program {tipeProgram}
            </h5>
          </div>

          <form onSubmit={handleSubmit} className={styles.programForm}>
            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Informasi Program</div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>
                    Judul Program<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul program"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>
                    Deskripsi<span className={styles.required}>*</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi program"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Thumbnail Program</div>

              <div
                className={`${styles.photoUpload} ${
                  photoPreview ? styles.active : ""
                }`}
                onClick={() =>
                  !isUploading && document.getElementById("photoInput")?.click()
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
                        : "Klik untuk upload foto atau drag & drop"}
                    </div>
                    <div className={styles.photoUploadHint}>
                      Format: JPG, PNG, WEBP (Min. 1KB, Maks. 5MB)
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

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        title="Konfirmasi Pembatalan"
        message="Apakah Anda yakin ingin membatalkan? Semua data yang sudah diisi akan hilang."
        confirmText="Ya, Batalkan"
        cancelText="Tidak"
        confirmButtonStyle="danger"
      />

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
