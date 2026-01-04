import { z } from "zod";

export const siswaSchema = z.object({
  nisn: z
    .string()
    .min(10, "NISN harus 10 digit")
    .max(10, "NISN harus 10 digit")
    .regex(/^\d+$/, "NISN harus berupa angka"),
  nama: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  kelas: z.enum(["X", "XI", "XII"], {
    message: "Pilih kelas yang valid",
  }),
  jurusan: z.string().min(1, "Pilih jurusan"),
  no_hp: z
    .string()
    .regex(/^(08|\+62)[0-9]{8,13}$/, "Format nomor HP tidak valid")
    .optional()
    .or(z.literal("")),
  jenis_kelamin: z.enum(["L", "P"], {
    message: "Pilih jenis kelamin",
  }),
  tempat_lahir: z
    .string()
    .min(3, "Tempat lahir minimal 3 karakter")
    .optional()
    .or(z.literal("")),
  tanggal_lahir: z
    .string()
    .min(1, "Tanggal lahir harus diisi")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 20;
    }, "Usia siswa harus antara 13-20 tahun"),
  alamat: z
    .string()
    .min(1, "Alamat minimal 1 karakter")
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .regex(
      /^\/api\/files\/siswa\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    )
    .optional()
    .or(z.literal("")),
});

export type SiswaFormData = z.infer<typeof siswaSchema>;

export const siswaUpdateSchema = siswaSchema.partial().required({ nisn: true });

export type SiswaUpdateData = z.infer<typeof siswaUpdateSchema>;
