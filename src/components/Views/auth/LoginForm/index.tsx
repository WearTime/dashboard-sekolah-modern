"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginSchema, type LoginInput } from "WT/validators/auth.validator";
import type { ApiResponse } from "WT/types";
import styles from "./LoginForm.module.css";
import { ZodError } from "zod";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login gagal");
        return;
      }

      toast.success("Login berhasil! Mengalihkan...");

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<LoginInput> = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (typeof field === "string") {
            fieldErrors[field as keyof LoginInput] = issue.message;
          }
        });

        setErrors(fieldErrors);
        toast.error("Mohon periksa input Anda");
      } else {
        toast.error("Terjadi kesalahan, silakan coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>
          Email
        </label>
        <div className={styles.inputGroupCustom}>
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.formControlCustom} ${
              errors.email ? styles.inputError : ""
            }`}
            placeholder="Masukkan email"
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.formLabel}>
          Password
        </label>
        <div className={styles.inputGroupCustom}>
          <i className="fas fa-lock"></i>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.formControlCustom} ${
              errors.password ? styles.inputError : ""
            }`}
            placeholder="Masukkan password"
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className={styles.errorText}>{errors.password}</p>
        )}
      </div>

      <div className={styles.rememberForgot}>
        <label className={styles.rememberMe}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <span>Ingat Saya</span>
        </label>
      </div>

      <button type="submit" className={styles.btnLogin} disabled={isLoading}>
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
