"use client";

import { useState, useEffect, useRef } from "react";
import { MapelWithRelations } from "WT/types/mapel";
import Modal from "WT/components/Layout/Modal";
import styles from "./EditMapelModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import { useMapel } from "WT/hooks/useMapel";

interface EditMapelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapel: MapelWithRelations | null;
  onSuccess: () => void;
}

interface Guru {
  nip: string;
  nama: string;
}

const EditMapelModal = ({
  isOpen,
  onClose,
  mapel,
  onSuccess,
}: EditMapelModalProps) => {
  const [formData, setFormData] = useState({
    nama_mapel: "",
    fase: "",
    tipe_mapel: "Umum" as "Umum" | "Jurusan",
    jurusan: "",
  });
  const [loading, setLoading] = useState(false);
  const { availableGuru, loadingGuru, fetchAvailableGuru, fetchMapelGuru } =
    useMapel();

  const [selectedGuru, setSelectedGuru] = useState<string[]>([]);
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
    if (mapel) {
      setFormData({
        nama_mapel: mapel.nama_mapel,
        fase: mapel.fase,
        tipe_mapel: mapel.tipe_mapel,
        jurusan: mapel.jurusan || "",
      });

      fetchMapelGuru(mapel.kode_mapel).then((data) => {
        const guruNips = data.map((item) => item.nip_guru);
        setSelectedGuru(guruNips);
      });
    }
  }, [mapel]);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableGuru();
    }
  }, [isOpen, fetchAvailableGuru]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuruToggle = (nip: string) => {
    setSelectedGuru((prev) => {
      if (prev.includes(nip)) {
        return prev.filter((n) => n !== nip);
      } else {
        return [...prev, nip];
      }
    });
  };

  const handleRemoveGuru = (nip: string) => {
    setSelectedGuru((prev) => prev.filter((n) => n !== nip));
  };

  const filteredGuru = availableGuru.filter((guru) =>
    guru.nama.toLowerCase().includes(guruSearchTerm.toLowerCase())
  );

  const getSelectedGuruNames = () => {
    return availableGuru
      .filter((guru) => selectedGuru.includes(guru.nip))
      .map((guru) => guru.nama);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapel) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        guru_nips: selectedGuru,
      };

      const res = await fetch(`/api/mapel/${mapel.kode_mapel}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengupdate data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mapel) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Data Mata Pelajaran"
      size="large"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="nama_mapel" className={styles.label}>
              Nama Mata Pelajaran <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="nama_mapel"
              name="nama_mapel"
              value={formData.nama_mapel}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="kode_mapel" className={styles.label}>
              Kode Mapel
            </label>
            <input
              type="text"
              id="kode_mapel"
              value={mapel.kode_mapel}
              className={styles.input}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fase" className={styles.label}>
              Fase <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="fase"
              name="fase"
              value={formData.fase}
              onChange={handleChange}
              className={styles.input}
              placeholder="Contoh: E, F"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipe_mapel" className={styles.label}>
              Tipe Mapel <span className={styles.required}>*</span>
            </label>
            <select
              id="tipe_mapel"
              name="tipe_mapel"
              value={formData.tipe_mapel}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="Umum">Umum</option>
              <option value="Jurusan">Jurusan</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="jurusan" className={styles.label}>
              Jurusan
            </label>
            <input
              type="text"
              id="jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              className={styles.input}
              placeholder="Kosongkan jika untuk semua jurusan"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Guru Pengampu</label>
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
                {selectedGuru.length === 0 ? (
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
                            handleRemoveGuru(selectedGuru[idx]);
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
                        <label key={guru.nip} className={styles.dropdownItem}>
                          <input
                            type="checkbox"
                            checked={selectedGuru.includes(guru.nip)}
                            onChange={() => handleGuruToggle(guru.nip)}
                            className={styles.checkbox}
                          />
                          <span>{guru.nama}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button
            type="button"
            className={styles.btnCancel}
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" className={styles.btnSubmit} disabled={loading}>
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

export default EditMapelModal;
