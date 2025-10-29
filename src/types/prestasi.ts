export interface Prestasi {
  id: string;
  name: string;
  description: string;
  penyelenggara: string;
  recipient_type: "Siswa" | "Sekolah" | "GTK";
  nama_penerima: string;
  level: "Provinsi" | "Nasional" | "Internasional";
  tanggal: Date;
  image: string;
  createdAt: Date;
}

export interface FilterPrestasiOptions {
  search: string;
  recipient_type: string;
  level: string;
}
