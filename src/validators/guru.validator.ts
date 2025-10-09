import { z } from "zod";

export const guruSchema = z
  .object({
    nip: z
      .string()
      .min(18, "NIP harus 18 digit")
      .max(18, "NIP harus 18 digit")
      .regex(/^\d+$/, "NIP harus berupa angka"),
    nama: z
      .string()
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    jenis_kelamin: z.enum(["L", "P"], {
      message: "Pilih jenis kelamin",
    }),
    no_hp: z
      .string()
      .regex(/^(08|\+62)[0-9]{8,13}$/, "Format nomor HP tidak valid")
      .optional()
      .or(z.literal("")),
    alamat: z
      .string()
      .min(10, "Alamat minimal 10 karakter")
      .optional()
      .or(z.literal("")),
    status: z.enum(["ASN", "P3K", "Honorer"], {
      message: "Pilih status kepegawaian",
    }),
    golongan: z.string().optional().or(z.literal("")),
    image: z
      .string()
      .regex(
        /^\/uploads\/guru\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
        "Format path image tidak valid"
      )
      .optional()
      .or(z.literal("")),
    mapel_ids: z.array(z.string()).optional().default([]),
  })
  .superRefine(({ status, golongan }, ctx) => {
    if (status === "ASN" && golongan) {
      if (!/^(I|II|III|IV)\/(a|b|c|d)$/.test(golongan)) {
        ctx.addIssue({
          path: ["golongan"],
          code: z.ZodIssueCode.custom,
          message: "Format golongan tidak valid untuk ASN",
        });
      }
    }

    if (status === "P3K" && golongan) {
      if (!/^[1-9]$/.test(golongan)) {
        ctx.addIssue({
          path: ["golongan"],
          code: z.ZodIssueCode.custom,
          message: "Format golongan tidak valid untuk P3K",
        });
      }
    }
  });

export type GuruFormData = z.infer<typeof guruSchema>;

export const guruUpdateSchema = guruSchema.partial().required({ nip: true });
export type GuruUpdateData = z.infer<typeof guruUpdateSchema>;
