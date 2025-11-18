import { z } from "zod";

export const prestasiSchema = z.object({
  name: z
    .string()
    .min(3, "Nama prestasi minimal 3 karakter")
    .max(200, "Nama prestasi maksimal 200 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  penyelenggara: z
    .string()
    .min(3, "Nama penyelenggara minimal 3 karakter")
    .max(200, "Nama penyelenggara maksimal 200 karakter"),
  recipient_type: z.enum(["Siswa", "Sekolah", "GTK"], {
    message: "Pilih tipe penerima",
  }),
  nama_penerima: z
    .string()
    .min(3, "Nama penerima minimal 3 karakter")
    .max(200, "Nama penerima maksimal 200 karakter"),
  level: z.enum(["Provinsi", "Nasional", "Internasional"], {
    message: "Pilih tingkat prestasi",
  }),
  tanggal: z
    .string()
    .min(1, "Tanggal harus diisi")
    .refine((date) => {
      const prestasiDate = new Date(date);
      const today = new Date();
      return prestasiDate <= today;
    }, "Tanggal prestasi tidak boleh di masa depan"),
  image: z
    .string()
    .regex(
      /^\/api\/files\/prestasi\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    )
    .optional()
    .or(z.literal("")),
});

export type PrestasiFormData = z.infer<typeof prestasiSchema>;

export const prestasiUpdateSchema = prestasiSchema
  .partial()
  .required({ name: true });

export type PrestasiUpdateData = z.infer<typeof prestasiUpdateSchema>;
