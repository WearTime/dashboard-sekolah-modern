"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./TeacherAdd.module.css";
import Button from "WT/components/Ui/Button";
import { useUnsavedChanges } from "WT/hooks/useUnsavedChanges";
import ConfirmationModal from "WT/components/Layout/ConfirmationModal";
import { Mapel } from "WT/types/mapel";
import { useTeachers } from "WT/hooks/useTeacher";

interface TeacherFormData {
  nip: string;
  nama: string;
  jenis_kelamin: "L" | "P";
  no_hp: string;
  alamat: string;
  status: "ASN" | "P3K" | "Honorer";
  golongan: string;
  image?: string;
  mapel_ids: string[];
}

const initialFormData: TeacherFormData = {
  nip: "",
  nama: "",
  jenis_kelamin: "L",
  no_hp: "",
  alamat: "",
  status: "Honorer",
  golongan: "",
  mapel_ids: [],
};

export default function TambahGuru() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [formData, setFormData] = useState<TeacherFormData>(initialFormData);
  const [hasChanges, setHasChanges] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNavigateModal, setShowNavigateModal] = useState(false);
  const [pendingNavigationResolve, setPendingNavigationResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const { availableMapel, loadingMapel, fetchAvailableMapel } = useTeachers();
  const [isMapelDropdownOpen, setIsMapelDropdownOpen] = useState(false);
  const [mapelSearchTerm, setMapelSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getGolonganOptions = () => {
    if (formData.status === "ASN") {
      const golongan = [];
      const romawi = ["I", "II", "III", "IV"];
      for (let i = 0; i < 4; i++) {
        for (const j of ["a", "b", "c", "d"]) {
          golongan.push(`${romawi[i]}/${j}`);
        }
      }
      return golongan;
    } else if (formData.status === "P3K") {
      return Array.from({ length: 9 }, (_, i) => `${i + 1}`);
    }
    return [];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMapelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAvailableMapel();
  }, []);

  useEffect(() => {
    const isModified =
      formData.nip !== "" ||
      formData.nama !== "" ||
      formData.no_hp !== "" ||
      formData.alamat !== "" ||
      formData.golongan !== "" ||
      formData.mapel_ids.length > 0 ||
      uploadedImagePath !== "";

    setHasChanges(isModified);
  }, [formData, uploadedImagePath]);

  useEffect(() => {
    if (formData.status === "Honorer") {
      setFormData((prev) => ({ ...prev, golongan: "" }));
    }
  }, [formData.status]);

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
        await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
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

  const handleMapelToggle = (kode_mapel: string) => {
    setFormData((prev) => ({
      ...prev,
      mapel_ids: prev.mapel_ids.includes(kode_mapel)
        ? prev.mapel_ids.filter((k) => k !== kode_mapel)
        : [...prev.mapel_ids, kode_mapel],
    }));
  };

  const handleRemoveMapel = (kode_mapel: string) => {
    setFormData((prev) => ({
      ...prev,
      mapel_ids: prev.mapel_ids.filter((k) => k !== kode_mapel),
    }));
  };

  const filteredMapel = availableMapel.filter((mapel) =>
    mapel.nama_mapel.toLowerCase().includes(mapelSearchTerm.toLowerCase())
  );

  const getSelectedMapelNames = () => {
    return availableMapel
      .filter((mapel) => formData.mapel_ids.includes(mapel.kode_mapel))
      .map((mapel) => mapel.nama_mapel);
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
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload/guru", {
        method: "POST",
        body: formDataUpload,
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
        await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
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
        golongan:
          formData.status === "Honorer" ? null : formData.golongan || null,
      };

      const response = await fetch("/api/guru", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Data guru berhasil disimpan!");
        setHasChanges(false);
        router.push("/guru");
      } else {
        toast.error(result.message || "Gagal menyimpan data guru");
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
      router.push("/guru");
    }
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    if (uploadedImagePath) {
      try {
        await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
    setHasChanges(false);
    router.push("/guru");
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  return (
    <>
      <div className={styles.contentArea}>
        <div className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <h5 className={styles.cardTitle}>Form Tambah Guru Baru</h5>
            <a href="#" className={styles.importBtn}>
              <span>Import</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className={styles.teacherForm}>
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
                    NIP<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIP (18 digit)"
                    maxLength={18}
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
              <div className={styles.sectionTitle}>Data Kepegawaian</div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Status Kepegawaian<span className={styles.required}>*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="ASN">ASN</option>
                    <option value="P3K">P3K</option>
                    <option value="Honorer">Honorer</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Golongan</label>
                  {formData.status === "Honorer" ? (
                    <input
                      type="text"
                      disabled
                      placeholder="Tidak ada golongan"
                    />
                  ) : (
                    <select
                      name="golongan"
                      value={formData.golongan}
                      onChange={handleInputChange}
                    >
                      <option value="">Pilih Golongan</option>
                      {getGolonganOptions().map((gol) => (
                        <option key={gol} value={gol}>
                          {gol}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>
                Mata Pelajaran yang Diampu
              </div>

              {loadingMapel ? (
                <div className={styles.loadingMapel}>
                  <i className="fas fa-spinner fa-spin"></i> Memuat data
                  mapel...
                </div>
              ) : (
                <div className={styles.multiSelectWrapper} ref={dropdownRef}>
                  <div
                    className={styles.multiSelectInput}
                    onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)}
                  >
                    {formData.mapel_ids.length === 0 ? (
                      <span className={styles.placeholder}>
                        Pilih mata pelajaran
                      </span>
                    ) : (
                      <div className={styles.selectedTags}>
                        {getSelectedMapelNames().map((name, idx) => (
                          <span key={idx} className={styles.tag}>
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMapel(formData.mapel_ids[idx]);
                              }}
                              className={styles.tagRemove}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <i
                      className={`fas fa-chevron-down ${styles.dropdownIcon}`}
                    ></i>
                  </div>

                  {isMapelDropdownOpen && (
                    <div className={styles.multiSelectDropdown}>
                      <div className={styles.dropdownSearch}>
                        <input
                          type="text"
                          placeholder="Cari mata pelajaran..."
                          value={mapelSearchTerm}
                          onChange={(e) => setMapelSearchTerm(e.target.value)}
                          className={styles.searchInput}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className={styles.dropdownList}>
                        {filteredMapel.length === 0 ? (
                          <div className={styles.noResults}>
                            {mapelSearchTerm
                              ? "Tidak ada hasil"
                              : "Belum ada data mapel"}
                          </div>
                        ) : (
                          filteredMapel.map((mapel) => (
                            <label
                              key={mapel.kode_mapel}
                              className={styles.dropdownItem}
                            >
                              <input
                                type="checkbox"
                                checked={formData.mapel_ids.includes(
                                  mapel.kode_mapel
                                )}
                                onChange={() =>
                                  handleMapelToggle(mapel.kode_mapel)
                                }
                                className={styles.checkbox}
                              />
                              <span>
                                {mapel.nama_mapel} - {mapel.tipe_mapel}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Informasi Kontak</div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>No. HP/WhatsApp</label>
                  <input
                    type="tel"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Alamat Lengkap</label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Foto Guru</div>

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
