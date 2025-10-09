export interface Guru {
  nip: string;
  nama: string;
  no_hp: string | null;
  alamat: string | null;
  jenis_kelamin: "L" | "P";
  image: string | null;
  status: "ASN" | "P3K" | "Honorer";
  golongan: string | null;
}

export interface GuruAndMapel {
  id: string;
  kode_mapel: string;
  nama_mapel: string;
  nip_guru: string;
}

export interface GuruWithRelations extends Guru {
  guruandmapel?: GuruAndMapel[];
  StructurOrganisasi?: {
    nip: string;
    jabatan: string;
  };
}

export interface FilterOptionsGuru {
  search: string;
  status: string;
  jenis_kelamin: string;
}
