"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./MapelAdd.module.css";
import Button from "WT/components/Ui/Button";
import { useUnsavedChanges } from "WT/hooks/useUnsavedChanges";
import ConfirmationModal from "WT/components/Layout/ConfirmationModal";
import { useMapel } from "WT/hooks/useMapel";

interface MapelFormData {
  kode_mapel: string;
  nama_mapel: string;
  fase: string;
  tipe_mapel: "Umum" | "Jurusan";
  jurusan: string;
  guru_nips: string[];
}

const initialFormData: MapelFormData = {
  kode_mapel: "",
  nama_mapel: "",
  fase: "",
  tipe_mapel: "Umum",
  jurusan: "",
  guru_nips: [],
};

export default function TambahMapel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MapelFormData>(initialFormData);
  const [hasChanges, setHasChanges] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNavigateModal, setShowNavigateModal] = useState(false);
  const [pendingNavigationResolve, setPendingNavigationResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const { availableGuru, loadingGuru, fetchAvailableGuru } = useMapel();
  const [isGuruDropdownOpen, setIsGuruDropdownOpen] = useState(false);
  const [guruSearchTerm, setGuruSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsGuruDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAvailableGuru();
  }, []);

  useEffect(() => {
    const isModified =
      formData.kode_mapel !== "" ||
      formData.nama_mapel !== "" ||
      formData.fase !== "" ||
      formData.jurusan !== "" ||
      formData.guru_nips.length > 0;

    setHasChanges(isModified);
  }, [formData]);

  const handleNavigationPrompt = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setShowNavigateModal(true);
      setPendingNavigationResolve(() => resolve);
    });
  };

  const handleNavigationConfirm = async () => {
    setShowNavigateModal(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuruToggle = (nip: string) => {
    setFormData((prev) => ({
      ...prev,
      guru_nips: prev.guru_nips.includes(nip)
        ? prev.guru_nips.filter((n) => n !== nip)
        : [...prev.guru_nips, nip],
    }));
  };

  const handleRemoveGuru = (nip: string) => {
    setFormData((prev) => ({
      ...prev,
      guru_nips: prev.guru_nips.filter((n) => n !== nip),
    }));
  };

  const filteredGuru = availableGuru.filter((guru) =>
    guru.nama.toLowerCase().includes(guruSearchTerm.toLowerCase())
  );

  const getSelectedGuruNames = () => {
    return availableGuru
      .filter((guru) => formData.guru_nips.includes(guru.nip))
      .map((guru) => guru.nama);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        jurusan: formData.jurusan || "Semua",
      };

      const response = await fetch("/api/mapel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Data mata pelajaran berhasil disimpan!");
        setHasChanges(false);
        router.push("/mapel");
      } else {
        toast.error(result.message || "Gagal menyimpan data mata pelajaran");
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
      router.push("/mapel");
    }
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    setHasChanges(false);
    router.push("/mapel");
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  return (
    <>
      <div className={styles.contentArea}>
        <div className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <h5 className={styles.cardTitle}>
              Form Tambah Mata Pelajaran Baru
            </h5>
            <a href="#" className={styles.importBtn}>
              <span>Import</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className={styles.mapelForm}>
            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>
                Informasi Mata Pelajaran
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Nama Mata Pelajaran
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_mapel"
                    value={formData.nama_mapel}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama mata pelajaran"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    Kode Mapel<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="kode_mapel"
                    value={formData.kode_mapel}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode mapel"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Fase<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fase"
                    value={formData.fase}
                    onChange={handleInputChange}
                    placeholder="Contoh: E, F"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    Tipe Mapel<span className={styles.required}>*</span>
                  </label>
                  <select
                    name="tipe_mapel"
                    value={formData.tipe_mapel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Umum">Umum</option>
                    <option value="Jurusan">Jurusan</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Jurusan</label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleInputChange}
                    placeholder="Kosongkan jika untuk semua jurusan"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>Guru Pengampu</div>

              {loadingGuru ? (
                <div className={styles.loadingGuru}>
                  <i className="fas fa-spinner fa-spin"></i> Memuat data guru...
                </div>
              ) : (
                <div className={styles.multiSelectWrapper} ref={dropdownRef}>
                  <div
                    className={styles.multiSelectInput}
                    onClick={() => setIsGuruDropdownOpen(!isGuruDropdownOpen)}
                  >
                    {formData.guru_nips.length === 0 ? (
                      <span className={styles.placeholder}>
                        Pilih guru pengampu
                      </span>
                    ) : (
                      <div className={styles.selectedTags}>
                        {getSelectedGuruNames().map((name, idx) => (
                          <span key={idx} className={styles.tag}>
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveGuru(formData.guru_nips[idx]);
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

                  {isGuruDropdownOpen && (
                    <div className={styles.multiSelectDropdown}>
                      <div className={styles.dropdownSearch}>
                        <input
                          type="text"
                          placeholder="Cari guru..."
                          value={guruSearchTerm}
                          onChange={(e) => setGuruSearchTerm(e.target.value)}
                          className={styles.searchInput}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className={styles.dropdownList}>
                        {filteredGuru.length === 0 ? (
                          <div className={styles.noResults}>
                            {guruSearchTerm
                              ? "Tidak ada hasil"
                              : "Belum ada data guru"}
                          </div>
                        ) : (
                          filteredGuru.map((guru) => (
                            <label
                              key={guru.nip}
                              className={styles.dropdownItem}
                            >
                              <input
                                type="checkbox"
                                checked={formData.guru_nips.includes(guru.nip)}
                                onChange={() => handleGuruToggle(guru.nip)}
                                className={styles.checkbox}
                              />
                              <span>
                                {guru.nama} - {guru.nip}
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

            <div className={styles.formActions}>
              <Button
                type="button"
                className={styles.btnCancel}
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className={styles.btnSubmit}
                disabled={isLoading}
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
