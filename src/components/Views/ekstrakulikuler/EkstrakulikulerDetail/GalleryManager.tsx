"use client";

import { useState } from "react";
import { EkstrakulikulerGallery } from "WT/types/ekstrakulikuler";
import Modal from "WT/components/Ui/Modal";
import Button from "WT/components/Ui/Button";
import styles from "./GalleryManager.module.css";
import { toast } from "react-toastify";

interface GalleryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  eskulId: string;
  eskulName: string;
  galleries: EkstrakulikulerGallery[];
  onUpdate: () => void;
}

const GalleryManager = ({
  isOpen,
  onClose,
  eskulId,
  eskulName,
  galleries,
  onUpdate,
}: GalleryManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 1000) {
      toast.error("Ukuran file terlalu kecil! Minimal 1KB");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak diizinkan! Hanya JPG, PNG, dan WEBP");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Mengupload foto...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload/ekstrakulikuler/gallery", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        throw new Error(uploadData.message);
      }

      const addRes = await fetch(`/api/ekstrakulikuler/${eskulId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePath: uploadData.data.path,
          caption: caption || undefined,
          order: galleries.length,
        }),
      });

      const addData = await addRes.json();

      if (addData.success) {
        toast.update(uploadToast, {
          render: "Foto berhasil ditambahkan!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setCaption("");
        onUpdate();
      } else {
        throw new Error(addData.message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengupload foto";

      toast.update(uploadToast, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (galleryId: string, imagePath: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;

    try {
      const res = await fetch(
        `/api/ekstrakulikuler/${eskulId}/gallery/${galleryId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetch(`/api/upload/ekstrakulikuler/gallery?path=${imagePath}`, {
          method: "DELETE",
        }).catch(console.error);

        toast.success("Foto berhasil dihapus");
        onUpdate();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus foto");
      console.error(error);
    }
  };

  const handleUpdateCaption = async (galleryId: string, newCaption: string) => {
    try {
      const res = await fetch(
        `/api/ekstrakulikuler/${eskulId}/gallery/${galleryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption: newCaption }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Caption berhasil diperbarui");
        setEditingId(null);
        onUpdate();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Gagal memperbarui caption");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Kelola Galeri - ${eskulName}`}
      size="large"
    >
      <div className={styles.galleryManager}>
        <div className={styles.uploadSection}>
          <h3 className={styles.sectionTitle}>Tambah Foto Baru</h3>
          <div className={styles.uploadArea}>
            {previewUrl ? (
              <div className={styles.previewContainer}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={styles.preview}
                />
                <Button
                  className={styles.btnRemovePreview}
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  disabled={uploading}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Klik untuk upload foto</p>
                <span>JPG, PNG, WEBP (Max. 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>

          {selectedFile && (
            <>
              <div className={styles.formGroup}>
                <label>Caption (Opsional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tambahkan caption untuk foto..."
                  disabled={uploading}
                />
              </div>

              <Button
                className={styles.btnUpload}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Mengupload...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload"></i>
                    <span>Upload Foto</span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        <div className={styles.galleryList}>
          <h3 className={styles.sectionTitle}>
            Foto yang Ada ({galleries.length})
          </h3>

          {galleries.length === 0 ? (
            <div className={styles.emptyGallery}>
              <i className="fas fa-images"></i>
              <p>Belum ada foto di galeri</p>
            </div>
          ) : (
            <div className={styles.galleryGrid}>
              {galleries.map((gallery, index) => (
                <div key={gallery.id} className={styles.galleryItem}>
                  <div className={styles.galleryImageContainer}>
                    <img
                      src={gallery.imagePath}
                      alt={gallery.caption || `Foto ${index + 1}`}
                      className={styles.galleryImage}
                    />
                    <div className={styles.galleryOverlay}>
                      <Button
                        className={styles.btnDeleteGallery}
                        onClick={() =>
                          handleDelete(gallery.id, gallery.imagePath)
                        }
                        title="Hapus"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>

                  <div className={styles.galleryInfo}>
                    {editingId === gallery.id ? (
                      <div className={styles.editCaption}>
                        <input
                          type="text"
                          defaultValue={gallery.caption || ""}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateCaption(
                                gallery.id,
                                e.currentTarget.value
                              );
                            } else if (e.key === "Escape") {
                              setEditingId(null);
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          className={styles.btnSaveCaption}
                          onClick={(e) => {
                            const input = e.currentTarget
                              .previousElementSibling as HTMLInputElement;
                            handleUpdateCaption(gallery.id, input.value);
                          }}
                        >
                          <i className="fas fa-check"></i>
                        </Button>
                      </div>
                    ) : (
                      <div className={styles.captionDisplay}>
                        <p>{gallery.caption || <em>Tidak ada caption</em>}</p>
                        <Button
                          className={styles.btnEditCaption}
                          onClick={() => setEditingId(gallery.id)}
                          title="Edit caption"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button className={styles.btnClose} onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GalleryManager;
