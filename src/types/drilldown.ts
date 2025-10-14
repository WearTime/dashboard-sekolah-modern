export type DrillLevel =
  | "main"
  | "gender"
  | "kelas"
  | "jurusan"
  | "status"
  | "golongan"
  | "tipe";

export interface DrillState {
  level: DrillLevel;
  filters: {
    gender?: "L" | "P";
    kelas?: "X" | "XI" | "XII";
    jurusan?: string;
    status?: "ASN" | "P3K" | "Honorer";
    golongan?: string;
    tipe?: "Umum" | "Jurusan";
  };
  entityType: "siswa" | "guru" | "stafftu" | "mapel" | null;
}

export interface StatCardData {
  icon: string;
  title: string;
  value: number | string;
  action?: () => void;
  filterKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterValue?: any;
}
