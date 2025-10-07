export type DrillLevel = "main" | "gender" | "kelas" | "jurusan";

export interface DrillState {
  level: DrillLevel;
  filters: {
    gender?: "L" | "P";
    kelas?: "X" | "XI" | "XII";
    jurusan?: string;
  };
  entityType: "siswa" | "guru" | "stafftu" | null;
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
