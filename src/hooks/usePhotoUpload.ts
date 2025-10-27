import { useState } from "react";
import { toast } from "react-toastify";

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
