import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
  role: z.enum(["ADMIN", "TEACHER", "PRINCIPAL"], {
    message: "Pilih role yang valid",
  }),
  permissions: z.array(z.string()).optional().default([]),
});

export type UserFormData = z.infer<typeof userSchema>;

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "TEACHER", "PRINCIPAL"], {
    message: "Pilih role yang valid",
  }),
  permissions: z.array(z.string()).optional().default([]),
});

export type UserUpdateData = z.infer<typeof userUpdateSchema>;
