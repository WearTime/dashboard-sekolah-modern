"use client";

import { useState } from "react";
import { SessionUser } from "WT/types";
import {
  Ekstrakulikuler,
  EkstrakulikulerGallery,
} from "WT/types/ekstrakulikuler";
import styles from "./EkstrakulikulerDetail.module.css";
import Button from "WT/components/Ui/Button";
import GalleryManager from "./GalleryManager";
import { toast } from "react-toastify";

interface EkstrakulikulerDetailProps {
  eskul: Ekstrakulikuler;
  user: SessionUser | null | undefined;
}

const EkstrakulikulerDetail = ({ eskul, user }: EkstrakulikulerDetailProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  const [galleries, setGalleries] = useState<EkstrakulikulerGallery[]>(
    eskul.galleries || []
  );

  const canManage =
    user && (user.role === "ADMIN" || user.role === "PRINCIPAL");

  const nextSlide = () => {
    if (galleries.length > 0) {
      setCurrentSlide((prev) => (prev === galleries.length - 1 ? 0 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (galleries.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? galleries.length - 1 : prev - 1));
    }
  };

  const handleGalleryUpdate = async () => {
    try {
      const res = await fetch(`/api/ekstrakulikuler/${eskul.id}/gallery`);
      const data = await res.json();
      if (data.success) {
        setGalleries(data.data);
        setCurrentSlide(0);
        toast.success("Galeri berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Gagal memperbarui galeri");
    }
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.gallerySection}>
          <div className={styles.gallerySectionHeader}>
            <h3 className={styles.sectionTitle}>Galeri Foto</h3>
            {canManage && (
              <Button
                className={styles.btnManageGallery}
                onClick={() => setShowGalleryManager(true)}
              >
                <i className="fas fa-images"></i>
                <span>Kelola Galeri</span>
              </Button>
            )}
          </div>

          {galleries.length > 0 ? (
            <div className={styles.galleryContainer}>
              <div className={styles.mainImageContainer}>
                <img
                  src={galleries[currentSlide].imagePath}
                  alt={galleries[currentSlide].caption || eskul.namaEskul}
                  className={styles.mainImage}
                />
                {galleries[currentSlide].caption && (
                  <div className={styles.imageCaption}>
                    {galleries[currentSlide].caption}
                  </div>
                )}
              </div>

              {galleries.length > 1 && (
                <>
                  <div className={styles.navigationButtons}>
                    <Button className={styles.btnNav} onClick={prevSlide}>
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    <div className={styles.slideCounter}>
                      {currentSlide + 1} / {galleries.length}
                    </div>
                    <Button className={styles.btnNav} onClick={nextSlide}>
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>

                  <div className={styles.thumbnailsContainer}>
                    {galleries.map((gallery, index) => (
                      <div
                        key={gallery.id}
                        className={`${styles.thumbnail} ${
                          index === currentSlide ? styles.activeThumbnail : ""
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <img
                          src={gallery.imagePath}
                          alt={gallery.caption || `Foto ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.noGallery}>
              <i className="fas fa-image"></i>
              <p>Belum ada foto di galeri</p>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.eskulName}>{eskul.namaEskul}</h1>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Pembina/Pendamping</span>
              <span className={styles.infoValue}>{eskul.pendamping}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ketua</span>
              <span className={styles.infoValue}>{eskul.ketua}</span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h6 className={styles.descriptionLabel}>Deskripsi</h6>
            <p className={styles.description}>{eskul.description}</p>
          </div>
        </div>
      </div>

      {showGalleryManager && canManage && (
        <GalleryManager
          isOpen={showGalleryManager}
          onClose={() => setShowGalleryManager(false)}
          eskulId={eskul.id}
          eskulName={eskul.namaEskul}
          galleries={galleries}
          onUpdate={handleGalleryUpdate}
        />
      )}
    </div>
  );
};

export default EkstrakulikulerDetail;
