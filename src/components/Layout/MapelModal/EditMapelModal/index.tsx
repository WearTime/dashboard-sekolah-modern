"use client";

import { useEffect, useState } from "react";
import { MapelWithRelations } from "WT/types/mapel";
import Modal from "WT/components/Ui/Modal";
import styles from "./EditMapelModal.module.css";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import { useMapel } from "WT/hooks/useMapel";
import { useForm } from "WT/hooks/useForm";
import { FormInput } from "WT/components/Ui/Form/FormInput";
import { FormSelect } from "WT/components/Ui/Form/FormSelect";
import MultiSelect from "WT/components/Ui/Form/MultiSelect";

interface EditMapelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapel: MapelWithRelations | null;
  onSuccess: () => void;
}

const EditMapelModal = ({
  isOpen,
  onClose,
  mapel,
  onSuccess,
}: EditMapelModalProps) => {
  const { availableGuru, loadingGuru, fetchAvailableGuru, fetchMapelGuru } =
    useMapel();
  const [selectedGuru, setSelectedGuru] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      nama_mapel: "",
      fase: "",
      tipe_mapel: "Umum" as "Umum" | "Jurusan",
      jurusan: "",
    },
    onSubmit: async (values) => {
      if (!mapel) return;

      const submitData = {
        ...values,
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
        throw new Error(data.message);
      }
    },
  });

  useEffect(() => {
    if (mapel) {
      form.setValues({
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

  const guruOptions = availableGuru.map((guru) => ({
    value: guru.nip,
    label: guru.nama,
  }));

  if (!mapel) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Data Mata Pelajaran"
      size="large"
    >
      <form onSubmit={form.handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <FormInput
            label="Nama Mata Pelajaran"
            name="nama_mapel"
            value={form.values.nama_mapel}
            onChange={form.handleChange}
            required
          />

          <FormInput label="Kode Mapel" value={mapel.kode_mapel} disabled />

          <FormInput
            label="Fase"
            name="fase"
            value={form.values.fase}
            onChange={form.handleChange}
            placeholder="Contoh: E, F"
            required
          />

          <FormSelect
            label="Tipe Mapel"
            name="tipe_mapel"
            value={form.values.tipe_mapel}
            onChange={form.handleChange}
            required
            options={[
              { value: "Umum", label: "Umum" },
              { value: "Jurusan", label: "Jurusan" },
            ]}
          />

          <FormInput
            label="Jurusan"
            name="jurusan"
            value={form.values.jurusan}
            onChange={form.handleChange}
            placeholder="Kosongkan jika untuk semua jurusan"
          />
        </div>

        <MultiSelect
          label="Guru Pengampu"
          placeholder="Pilih guru pengampu"
          options={guruOptions}
          selectedValues={selectedGuru}
          onChange={setSelectedGuru}
          loading={loadingGuru}
          searchable={true}
        />

        <div className={styles.modalActions}>
          <Button
            type="button"
            className={styles.btnCancel}
            onClick={onClose}
            disabled={form.loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className={styles.btnSubmit}
            disabled={form.loading}
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

export default EditMapelModal;
