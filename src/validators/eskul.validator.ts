import { z } from "zod";

export const ekstrakulikulerSchema = z.object({
  namaEskul: z
    .string()
    .min(3, "Nama ekstrakulikuler minimal 3 karakter")
    .max(100, "Nama ekstrakulikuler maksimal 100 karakter"),
  pendamping: z
    .string()
    .min(3, "Nama pendamping minimal 3 karakter")
    .max(100, "Nama pendamping maksimal 100 karakter"),
  ketua: z
    .string()
    .min(3, "Nama ketua minimal 3 karakter")
    .max(100, "Nama ketua maksimal 100 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  imagesThumbnail: z
    .string()
    .regex(
      /^\/uploads\/ekstrakulikuler\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    )
    .optional()
    .or(z.literal("")),
});

export type EkstrakulikulerFormData = z.infer<typeof ekstrakulikulerSchema>;

export const ekstrakulikulerUpdateSchema = ekstrakulikulerSchema
  .partial()
  .required({ namaEskul: true });

export type EkstrakulikulerUpdateData = z.infer<
  typeof ekstrakulikulerUpdateSchema
>;
