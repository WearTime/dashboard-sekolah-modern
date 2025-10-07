export interface Siswa {
  nisn: string;
  nama: string;
  kelas: string;
  jurusan: string;
  no_hp: string | null;
  jenis_kelamin: "L" | "P";
  tempat_lahir: string | null;
  tanggal_lahir: Date | null;
  alamat: string | null;
  image: string | null;
}

export interface PaginationData {
  totalPages: number;
  total: number;
  currentPage: number;
  limit: number;
}

export interface FilterOptions {
  search: string;
  kelas: string;
  jurusan: string;
  jenis_kelamin: string;
}
