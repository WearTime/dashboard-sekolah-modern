"use client";

import { useState, useEffect, useRef } from "react";
import { GuruWithRelations } from "WT/types/teacher";
import Modal from "WT/components/Layout/Modal";
import styles from "./EditTeacherModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import { useTeachers } from "WT/hooks/useTeacher";

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: GuruWithRelations | null;
  onSuccess: () => void;
}

const EditTeacherModal = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}: EditTeacherModalProps) => {
  const [formData, setFormData] = useState({
    nama: "",
    jenis_kelamin: "L" as "L" | "P",
    no_hp: "",
    alamat: "",
    status: "Honorer" as "ASN" | "P3K" | "Honorer",
    golongan: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [originalImagePath, setOriginalImagePath] = useState<string>("");
  const { availableMapel, loadingMapel, fetchAvailableMapel, fetchGuruMapel } =
    useTeachers();

  const [selectedMapel, setSelectedMapel] = useState<string[]>([]);
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
    if (teacher) {
      const imagePath = teacher.image || "";
      setFormData({
        nama: teacher.nama,
        jenis_kelamin: teacher.jenis_kelamin,
        no_hp: teacher.no_hp || "",
        alamat: teacher.alamat || "",
        status: teacher.status,
        golongan: teacher.golongan || "",
        image: imagePath,
      });
      setOriginalImagePath(imagePath);
      setPhotoPreview(imagePath);
      setUploadedImagePath("");

      fetchGuruMapel(teacher.nip).then((data) => {
        const mapelIds = data.map((item) => item.kode_mapel);
        setSelectedMapel(mapelIds);
      });
    }
  }, [teacher]);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableMapel();
    }
  }, [isOpen, fetchAvailableMapel]);

  useEffect(() => {
    if (formData.status === "Honorer") {
      setFormData((prev) => ({ ...prev, golongan: "" }));
    }
  }, [formData.status]);

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

  const handleMapelToggle = (kode_mapel: string) => {
    setSelectedMapel((prev) => {
      if (prev.includes(kode_mapel)) {
        return prev.filter((k) => k !== kode_mapel);
      } else {
        return [...prev, kode_mapel];
      }
    });
  };

  const handleRemoveMapel = (kode_mapel: string) => {
    setSelectedMapel((prev) => prev.filter((k) => k !== kode_mapel));
  };

  const filteredMapel = availableMapel.filter((mapel) =>
    mapel.nama_mapel.toLowerCase().includes(mapelSearchTerm.toLowerCase())
  );

  const getSelectedMapelNames = () => {
    return availableMapel
      .filter((mapel) => selectedMapel.includes(mapel.kode_mapel))
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
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/guru", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
          try {
            await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
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
        await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
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

    if (!teacher) return;

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
        image: finalImagePath || null,
        mapel_ids: selectedMapel,
      };

      const res = await fetch(`/api/guru/${teacher.nip}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (data.success) {
        if (originalImagePath && originalImagePath !== finalImagePath) {
          try {
            await fetch(`/api/upload/guru?path=${originalImagePath}`, {
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
            await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
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
          await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
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
        await fetch(`/api/upload/guru?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting uploaded photo:", error);
      }
    }
    onClose();
  };

  if (!teacher) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Edit Data Guru"
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
            <label htmlFor="nip" className={styles.label}>
              NIP
            </label>
            <input
              type="text"
              id="nip"
              value={teacher.nip}
              className={styles.input}
              disabled
            />
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
            <label htmlFor="status" className={styles.label}>
              Status Kepegawaian <span className={styles.required}>*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="ASN">ASN</option>
              <option value="P3K">P3K</option>
              <option value="Honorer">Honorer</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="golongan" className={styles.label}>
              Golongan
            </label>
            {formData.status === "Honorer" ? (
              <input
                type="text"
                id="golongan"
                className={styles.input}
                disabled
                placeholder="Tidak ada golongan"
              />
            ) : (
              <select
                id="golongan"
                name="golongan"
                value={formData.golongan}
                onChange={handleChange}
                className={styles.select}
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
          <label className={styles.label}>Mata Pelajaran yang Diampu</label>
          {loadingMapel ? (
            <div className={styles.loadingMapel}>
              <i className="fas fa-spinner fa-spin"></i> Memuat data mapel...
            </div>
          ) : (
            <div className={styles.multiSelectWrapper} ref={dropdownRef}>
              <div
                className={styles.multiSelectInput}
                onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)}
              >
                {selectedMapel.length === 0 ? (
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
                            handleRemoveMapel(selectedMapel[idx]);
                          }}
                          className={styles.tagRemove}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <i className={`fas fa-chevron-down ${styles.dropdownIcon}`}></i>
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
                            checked={selectedMapel.includes(mapel.kode_mapel)}
                            onChange={() => handleMapelToggle(mapel.kode_mapel)}
                            className={styles.checkbox}
                          />
                          <span>{mapel.nama_mapel}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Foto Guru</label>
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

export default EditTeacherModal;
