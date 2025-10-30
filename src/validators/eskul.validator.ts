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
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type EkstrakulikulerFormData = z.infer<typeof ekstrakulikulerSchema>;

export const ekstrakulikulerUpdateSchema = ekstrakulikulerSchema
  .partial()
  .required({ namaEskul: true });

export type EkstrakulikulerUpdateData = z.infer<
  typeof ekstrakulikulerUpdateSchema
>;

export const gallerySchema = z.object({
  imagePath: z
    .string()
    .regex(
      /^\/uploads\/ekstrakulikuler\/gallery\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i,
      "Format path image tidak valid"
    ),
  caption: z.string().max(200, "Caption maksimal 200 karakter").optional(),
  order: z.number().int().min(0).default(0),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;

export const galleryUpdateSchema = gallerySchema.partial();

export type GalleryUpdateData = z.infer<typeof galleryUpdateSchema>;
