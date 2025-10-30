export type TipeProgram = "Kurikulum" | "Sarpras" | "Siswa" | "Humas";

export interface ProgramSekolah {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_program: TipeProgram;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Jurusan {
  kode: string;
  nama: string;
  nama_lengkap: string;
  deskripsi: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramJurusan {
  id: string;
  kode_jurusan: string;
  program_id: string;
  judul: string;
  deskripsi: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  jurusan?: Jurusan;
}

export interface KegiatanProgram {
  id: string;
  program_id: string | null;
  program_jurusan_id: string | null;
  nama_kegiatan: string;
  deskripsi: string;
  tanggal: Date;
  lokasi: string | null;
  peserta: string | null;
  images: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterProgramOptions {
  search: string;
  tipe_program: string;
}

export interface FilterProgramJurusanOptions {
  search: string;
  kode_jurusan: string;
}
