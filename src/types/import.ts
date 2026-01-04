import { z } from "zod";

/*
|============================================|
                CODE REMINDER                       
|============================================|
|
|=> ImportColumn Informasi
| header -> header di excelnya
| field -> Field yang ada di database/form
| transform -> transform value sebelum validasi
| description -> desk untuk tempaltenya
|
|=> ImportConfig Informasi
| entityName -> nama entity seperti siswa, guru, prestasi, dll
| validator -> Zod Validasi
| batchSize -> jumlah data per batch insert
| templateName -> nama file template
|
| Terakhir diubah: 12/22/2025
| Oleh           : WearTime - The Creator Of This Project
|============================================|
*/

export interface ImportColumn {
  header: string;
  field: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (value: any) => any;
  description?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ImportConfig<T = any> {
  entityName: string;
  columns: ImportColumn[];
  validator: z.ZodSchema<T>;
  batchSize?: number;
  templateName: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: ImportError[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export interface ImportProgress {
  total: number;
  processed: number;
  success: number;
  failed: number;
  percentage: number;
  status: "processing" | "completed" | "failed";
}
