"use client";

import { Ekstrakulikuler } from "WT/types/ekstrakulikuler";
import styles from "./EkstrakulikulerSlide.module.css";
import Button from "WT/components/Ui/Button";

interface SlideViewProps {
  ekstrakulikuler: Ekstrakulikuler[];
  loading: boolean;
  currentSlide: number;
  onNext: () => void;
  onPrev: () => void;
  onSlideChange: (index: number) => void;
  onAddClick: () => void;
  onListClick: () => void;
}

const SlideView = ({
  ekstrakulikuler,
  loading,
  currentSlide,
  onNext,
  onPrev,
  onSlideChange,
  onAddClick,
  onListClick,
}: SlideViewProps) => {
  if (loading) {
    return (
      <div className={styles.slideContainer}>
        <div className={styles.header}>
          <h5 className={styles.title}>Ekstrakulikuler</h5>
          <div className={styles.headerActions}>
            <Button className={styles.btnAdd} onClick={onAddClick}>
              <i className="fas fa-plus"></i>
              <span>Tambah</span>
            </Button>
            <Button className={styles.btnList} onClick={onListClick}>
              <i className="fas fa-list"></i>
              <span>List</span>
            </Button>
          </div>
        </div>
        <div className={styles.loadingState}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Memuat data ekstrakulikuler...</p>
        </div>
      </div>
    );
  }

  if (ekstrakulikuler.length === 0) {
    return (
      <div className={styles.slideContainer}>
        <div className={styles.header}>
          <h5 className={styles.title}>Ekstrakulikuler</h5>
          <div className={styles.headerActions}>
            <Button className={styles.btnAdd} onClick={onAddClick}>
              <i className="fas fa-plus"></i>
              <span>Tambah</span>
            </Button>
            <Button className={styles.btnList} onClick={onListClick}>
              <i className="fas fa-list"></i>
              <span>List</span>
            </Button>
          </div>
        </div>
        <div className={styles.emptyState}>
          <i className="fas fa-inbox"></i>
          <h3>Belum Ada Data Ekstrakulikuler</h3>
          <p>
            Klik tombol &quot;Tambah&quot; untuk menambahkan ekstrakulikuler
            baru
          </p>
        </div>
      </div>
    );
  }

  const currentEskul = ekstrakulikuler[currentSlide];

  return (
    <div className={styles.slideContainer}>
      <div className={styles.header}>
        <h5 className={styles.title}>Ekstrakulikuler</h5>
        <div className={styles.headerActions}>
          <Button className={styles.btnAdd} onClick={onAddClick}>
            <i className="fas fa-plus"></i>
            <span>Tambah</span>
          </Button>
          <Button className={styles.btnList} onClick={onListClick}>
            <i className="fas fa-list"></i>
            <span>List</span>
          </Button>
        </div>
      </div>

      <div className={styles.slideWrapper}>
        <div className={styles.slideContent}>
          <div className={styles.thumbnailSection}>
            <div className={styles.thumbnailContainer}>
              {currentEskul.imagesThumbnail ? (
                <img
                  src={currentEskul.imagesThumbnail}
                  alt={currentEskul.namaEskul}
                  className={styles.thumbnail}
                />
              ) : (
                <div className={styles.noImage}>
                  <i className="fas fa-image"></i>
                  <p>Tidak ada gambar</p>
                </div>
              )}
            </div>

            {ekstrakulikuler.length > 1 && (
              <div className={styles.slideIndicators}>
                {ekstrakulikuler.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${
                      index === currentSlide ? styles.active : ""
                    }`}
                    onClick={() => onSlideChange(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailSection}>
            <h2 className={styles.eskulName}>{currentEskul.namaEskul}</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Pembina/Pendamping</span>
                <span className={styles.infoValue}>
                  {currentEskul.pendamping}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ketua</span>
                <span className={styles.infoValue}>{currentEskul.ketua}</span>
              </div>
            </div>

            <div className={styles.descriptionSection}>
              <h6 className={styles.descriptionLabel}>Deskripsi</h6>
              <p className={styles.description}>{currentEskul.description}</p>
            </div>
          </div>

          <div className={styles.navigationButtons}>
            <Button
              className={styles.btnNav}
              onClick={onPrev}
              disabled={ekstrakulikuler.length <= 1}
              title="Sebelumnya"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Button
              className={styles.btnNav}
              onClick={onNext}
              disabled={ekstrakulikuler.length <= 1}
              title="Selanjutnya"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideView;
