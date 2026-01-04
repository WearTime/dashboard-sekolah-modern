import { TipeProgram } from "WT/types/program";

export interface ProgramConfig {
  tipe: TipeProgram;
  title: string;
  titleFull: string;
  path: string;
  permissionPrefix: string;
}

export const PROGRAM_CONFIGS: Record<TipeProgram, ProgramConfig> = {
  Kurikulum: {
    tipe: "Kurikulum",
    title: "Kurikulum",
    titleFull: "Program Kurikulum",
    path: "kurikulum",
    permissionPrefix: "program.kurikulum",
  },
  Sarpras: {
    tipe: "Sarpras",
    title: "Sarpras",
    titleFull: "Program Sarana dan Prasarana",
    path: "sarpras",
    permissionPrefix: "program.sarpras",
  },
  Siswa: {
    tipe: "Siswa",
    title: "Siswa",
    titleFull: "Program Kesiswaan",
    path: "siswa",
    permissionPrefix: "program.siswa",
  },
  Humas: {
    tipe: "Humas",
    title: "Humas",
    titleFull: "Program Hubungan Masyarakat",
    path: "humas",
    permissionPrefix: "program.humas",
  },
} as const;

export const getProgramConfig = (tipe: TipeProgram): ProgramConfig => {
  return PROGRAM_CONFIGS[tipe];
};

export const getProgramConfigByPath = (path: string): ProgramConfig | null => {
  const entry = Object.values(PROGRAM_CONFIGS).find(
    (config) => config.path === path.toLowerCase()
  );
  return entry || null;
};
