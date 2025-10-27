"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Button from "WT/components/Ui/Button";
import styles from "../Form.module.css";

interface PhotoUploadProps {
  label?: string;
  uploadEndpoint: string;
  deleteEndpoint: string;
  initialPhoto?: string;
  onPhotoChange: (photoPath: string) => void;
  maxSize?: number;
}

export const usePhotoUpload = (
  uploadEndpoint: string,
  deleteEndpoint: string,
  initialPhoto?: string
) => {
  const [photoPreview, setPhotoPreview] = useState<string>(initialPhoto || "");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [originalImagePath] = useState<string>(initialPhoto || "");
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const uploadToast = toast.loading("Mengupload foto...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
          try {
            await fetch(`${deleteEndpoint}?path=${uploadedImagePath}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.error("Error deleting old uploaded photo:", error);
          }
        }

        setUploadedImagePath(result.data.path);
        setPhotoPreview(result.data.path);

        toast.update(uploadToast, {
          render: "Foto berhasil diupload!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        return result.data.path;
      } else {
        toast.update(uploadToast, {
          render: result.message || "Gagal mengupload foto",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return null;
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.update(uploadToast, {
        render: "Terjadi kesalahan saat mengupload foto",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async () => {
    if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
      try {
        await fetch(`${deleteEndpoint}?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }

    setPhotoPreview("");
    setUploadedImagePath("");
  };

  const cleanup = async () => {
    if (uploadedImagePath && uploadedImagePath !== originalImagePath) {
      try {
        await fetch(`${deleteEndpoint}?path=${uploadedImagePath}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting uploaded photo:", error);
      }
    }
  };

  const getFinalImagePath = () => {
    if (uploadedImagePath) return uploadedImagePath;
    if (photoPreview) return originalImagePath;
    return "";
  };

  return {
    photoPreview,
    isUploading,
    uploadPhoto,
    removePhoto,
    cleanup,
    getFinalImagePath,
    setPhotoPreview,
    uploadedImagePath,
    originalImagePath,
  };
};

const PhotoUpload = ({
  label = "Foto",
  uploadEndpoint,
  deleteEndpoint,
  initialPhoto,
  onPhotoChange,
  maxSize = 1,
}: PhotoUploadProps) => {
  const photoUploadHook = usePhotoUpload(
    uploadEndpoint,
    deleteEndpoint,
    initialPhoto
  );
  const {
    photoPreview,
    isUploading,
    uploadPhoto,
    removePhoto,
    setPhotoPreview,
  } = photoUploadHook;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Ukuran file terlalu besar! Maksimal ${maxSize}MB`);
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak diizinkan! Hanya JPG, PNG, dan WEBP");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    const uploadedPath = await uploadPhoto(file);
    if (uploadedPath) {
      onPhotoChange(uploadedPath);
    } else {
      setPhotoPreview(initialPhoto || "");
      e.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    await removePhoto();
    onPhotoChange("");
    const input = document.getElementById("photoInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <div
        className={`${styles.photoUpload} ${photoPreview ? styles.active : ""}`}
        onClick={() =>
          !isUploading && document.getElementById("photoInput")?.click()
        }
      >
        {photoPreview ? (
          <div className={styles.photoPreview}>
            <img src={photoPreview} alt="Preview" />
            <Button
              type="button"
              className={styles.removePhotoBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhoto();
              }}
              disabled={isUploading}
            >
              <i className="fas fa-times"></i>
            </Button>
            <div className={styles.changePhotoText}>
              Klik untuk mengganti foto
            </div>
          </div>
        ) : (
          <>
            <div className={styles.photoUploadIcon}>
              <i
                className={
                  isUploading
                    ? "fas fa-spinner fa-spin"
                    : "fas fa-cloud-upload-alt"
                }
              ></i>
            </div>
            <div className={styles.photoUploadText}>
              {isUploading ? "Mengupload foto..." : "Klik untuk upload foto"}
            </div>
            <div className={styles.photoUploadHint}>
              Format: JPG, PNG, WEBP (Maks. {maxSize}MB)
            </div>
          </>
        )}
        <input
          type="file"
          id="photoInput"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handlePhotoUpload}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
