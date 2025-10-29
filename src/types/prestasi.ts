export interface Prestasi {
  id: string;
  name: string;
  description: string;
  penyelenggara: string;
  recipient_type: "Siswa" | "Sekolah" | "GTK";
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
