export interface Mapel {
  kode_mapel: string;
  nama_mapel: string;
  fase: string;
  tipe_mapel: "Umum" | "Jurusan";
  jurusan: string;
}

export interface MapelAndGuru {
  id: string;
  kode_mapel: string;
  nip_guru: string;
  guru?: {
    nip: string;
    nama: string;
  };
}

export interface MapelWithRelations extends Mapel {
  guruandmapel?: MapelAndGuru[];
}

export interface MapelGuruRelation {
  id: string;
  kode_mapel: string;
  nip_guru: string;
  guru?: {
    nip: string;
    nama: string;
  };
}

export interface FilterOptionsMapel {
  search: string;
  tipe_mapel: string;
  jurusan: string;
}
