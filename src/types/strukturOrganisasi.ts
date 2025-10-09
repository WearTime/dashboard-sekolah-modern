export interface StrukturOrganisasi {
  nip: string;
  jabatan: string;
}

export interface StrukturOrganisasiWithGuru extends StrukturOrganisasi {
  guru: {
    nip: string;
    nama: string;
    no_hp: string | null;
    jenis_kelamin: "L" | "P";
    image: string | null;
    status: "ASN" | "P3K" | "Honorer";
  };
}

export interface FilterOptionsStruktur {
  search: string;
  jabatan: string;
}
