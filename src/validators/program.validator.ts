import { z } from "zod";

export const programSekolahSchema = z.object({
  judul: z
    .string()
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  deskripsi: z
    .string()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  tipe_program: z.enum(["Kurikulum", "Sarpras", "Siswa", "Humas"], {
    message: "Pilih tipe program yang valid",
  }),
  thumbnail: z
    .string()
    .regex(
      /^\/api\/files\/program\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    )
    .optional()
    .or(z.literal("")),
});

export type ProgramSekolahFormData = z.infer<typeof programSekolahSchema>;

export const programSekolahUpdateSchema = programSekolahSchema
  .partial()
  .required({ judul: true });

export type ProgramSekolahUpdateData = z.infer<
  typeof programSekolahUpdateSchema
>;

export const programJurusanSchema = z.object({
  kode_jurusan: z.string().min(1, "Pilih jurusan"),
  judul: z
    .string()
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  deskripsi: z
    .string()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  thumbnail: z
    .string()
    .regex(
      /^\/api\/files\/program-jurusan\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    )
    .optional()
    .or(z.literal("")),
});

export type ProgramJurusanFormData = z.infer<typeof programJurusanSchema>;

export const kegiatanProgramSchema = z.object({
  nama_kegiatan: z
    .string()
    .min(5, "Nama kegiatan minimal 5 karakter")
    .max(200, "Nama kegiatan maksimal 200 karakter"),
  deskripsi: z
    .string()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  lokasi: z
    .string()
    .min(3, "Lokasi minimal 3 karakter")
    .optional()
    .or(z.literal("")),
  peserta: z.string().optional().or(z.literal("")),
  images: z
    .string()
    .regex(
      /^\/api\/files\/kegiatan\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    )
    .optional()
    .or(z.literal("")),
});

export type KegiatanProgramFormData = z.infer<typeof kegiatanProgramSchema>;
