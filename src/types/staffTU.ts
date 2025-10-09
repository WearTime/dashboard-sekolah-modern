export interface StaffTU {
  nip: string;
  nama: string;
  no_hp: string | null;
  alamat: string | null;
  image: string | null;
  jenis_kelamin: "L" | "P";
}

export interface FilterOptionsStaffTU {
  search: string;
  jenis_kelamin: string;
}
