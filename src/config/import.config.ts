import { ImportConfig } from "WT/types/import";
import { siswaSchema } from "WT/validators/siswa.validator";
import { guruSchema } from "WT/validators/guru.validator";
import { prestasiSchema } from "WT/validators/prestasi.validator";

export const siswaImportConfig: ImportConfig = {
  entityName: "siswa",
  templateName: "Template_Import_Siswa.xlsx",
  batchSize: 50,
  columns: [
    {
      header: "NISN",
      field: "nisn",
      required: true,
      description: "Nomor Induk Siswa Nasional (10 digit)",
    },
    {
      header: "Nama Lengkap",
      field: "nama",
      required: true,
      description: "Nama lengkap siswa",
    },
    {
      header: "Kelas",
      field: "kelas",
      required: true,
      description: "Kelas siswa (X, XI, atau XII)",
      transform: (value) => String(value).toUpperCase().trim(),
    },
    {
      header: "Jurusan",
      field: "jurusan",
      required: true,
      description: "Kode jurusan (PPLG, TKJ, AKL, dll)",
      transform: (value) => String(value).toUpperCase().trim(),
    },
    {
      header: "Jenis Kelamin",
      field: "jenis_kelamin",
      required: true,
      description: "L untuk Laki-laki, P untuk Perempuan",
      transform: (value) => String(value).toUpperCase().trim(),
    },
    {
      header: "Tempat Lahir",
      field: "tempat_lahir",
      required: false,
      description: "Tempat lahir siswa",
    },
    {
      header: "Tanggal Lahir",
      field: "tanggal_lahir",
      required: true,
      description: "Format: YYYY-MM-DD atau DD/MM/YYYY",
      transform: (value) => {
        if (!value) return "";

        if (value instanceof Date) {
          return value.toISOString().split("T")[0];
        }

        const dateStr = String(value).trim();

        // Format DD/MM/YYYY atau DD-MM-YYYY
        if (dateStr.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/)) {
          const parts = dateStr.split(/[\/\-]/);
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }

        // Format YYYY-MM-DD
        if (dateStr.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0];
        }

        return dateStr;
      },
    },
    {
      header: "No HP",
      field: "no_hp",
      required: false,
      description: "Nomor HP/WhatsApp (08xxx atau +62xxx)",
      transform: (value) => {
        if (!value) return "";
        return String(value).replace(/\s+/g, "").trim();
      },
    },
    {
      header: "Alamat",
      field: "alamat",
      required: false,
      description: "Alamat lengkap siswa",
    },
  ],
  validator: siswaSchema.omit({ image: true }),
};

export const guruImportConfig: ImportConfig = {
  entityName: "guru",
  templateName: "Template_Import_Guru.xlsx",
  batchSize: 50,
  columns: [
    {
      header: "NIP",
      field: "nip",
      required: true,
      description: "Nomor Induk Pegawai (18 digit)",
      transform: (value) => String(value).replace(/\s+/g, "").trim(),
    },
    {
      header: "Nama Lengkap",
      field: "nama",
      required: true,
      description: "Nama lengkap guru",
    },
    {
      header: "Jenis Kelamin",
      field: "jenis_kelamin",
      required: true,
      description: "L untuk Laki-laki, P untuk Perempuan",
      transform: (value) => String(value).toUpperCase().trim(),
    },
    {
      header: "Status Kepegawaian",
      field: "status",
      required: true,
      description: "ASN, P3K, atau Honorer",
      transform: (value) => String(value).toUpperCase().trim(),
    },
    {
      header: "Golongan",
      field: "golongan",
      required: false,
      description: "Golongan (contoh: III/a untuk ASN, 5 untuk P3K)",
      transform: (value) => {
        if (!value) return "";
        return String(value).trim();
      },
    },
    {
      header: "No HP",
      field: "no_hp",
      required: false,
      description: "Nomor HP/WhatsApp (08xxx atau +62xxx)",
      transform: (value) => {
        if (!value) return "";
        return String(value).replace(/\s+/g, "").trim();
      },
    },
    {
      header: "Alamat",
      field: "alamat",
      required: false,
      description: "Alamat lengkap guru",
    },
  ],
  validator: guruSchema.omit({ image: true, mapel_ids: true }),
};

export const prestasiImportConfig: ImportConfig = {
  entityName: "prestasi",
  templateName: "Template_Import_Prestasi.xlsx",
  batchSize: 50,
  columns: [
    {
      header: "Nama Prestasi",
      field: "name",
      required: true,
      description: "Nama prestasi yang diraih",
    },
    {
      header: "Deskripsi",
      field: "description",
      required: true,
      description: "Deskripsi detail prestasi",
    },
    {
      header: "Penyelenggara",
      field: "penyelenggara",
      required: true,
      description: "Nama penyelenggara lomba/kompetisi",
    },
    {
      header: "Tipe Penerima",
      field: "recipient_type",
      required: true,
      description: "Siswa, Sekolah, atau GTK",
      transform: (value) => String(value).trim(),
    },
    {
      header: "Nama Penerima",
      field: "nama_penerima",
      required: true,
      description: "Nama siswa/guru/sekolah penerima",
    },
    {
      header: "Tingkat",
      field: "level",
      required: true,
      description: "Provinsi, Nasional, atau Internasional",
      transform: (value) => String(value).trim(),
    },
    {
      header: "Tanggal",
      field: "tanggal",
      required: true,
      description: "Format: YYYY-MM-DD atau DD/MM/YYYY",
      transform: (value) => {
        if (!value) return "";

        if (value instanceof Date) {
          return value.toISOString().split("T")[0];
        }

        const dateStr = String(value).trim();

        if (dateStr.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/)) {
          const parts = dateStr.split(/[\/\-]/);
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }

        if (dateStr.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0];
        }

        return dateStr;
      },
    },
  ],
  validator: prestasiSchema.omit({ image: true }),
};

export const importConfigs = {
  siswa: siswaImportConfig,
  guru: guruImportConfig,
  prestasi: prestasiImportConfig,
} as const;

export type ImportEntityType = keyof typeof importConfigs;
export const entityLabels: Record<ImportEntityType, string> = {
  siswa: "Siswa",
  guru: "Guru",
  prestasi: "Prestasi",
};
