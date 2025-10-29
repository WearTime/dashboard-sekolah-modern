"use client";

import { Prestasi } from "WT/types/prestasi";
import styles from "./PrestasiSlide.module.css";
import Button from "WT/components/Ui/Button";
import { useState } from "react";

interface SlideViewProps {
  prestasi: Prestasi[];
  loading: boolean;
  onAddClick: () => void;
  onListClick: () => void;
  prestasiType: "Siswa" | "Sekolah" | "GTK";
  level?: "Provinsi" | "Nasional" | "Internasional";
}

const SlideView = ({
  prestasi,
  loading,
  onAddClick,
  onListClick,
  prestasiType,
  level,
}: SlideViewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const getTitle = () => {
    if (level) {
      return `Prestasi ${prestasiType} ${level}`;
    }
    return `Prestasi ${prestasiType}`;
  };

  const nextSlide = () => {
    if (prestasi.length > 0) {
      setCurrentSlide((prev) => (prev === prestasi.length - 1 ? 0 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (prestasi.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? prestasi.length - 1 : prev - 1));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getBadgeClass = (type: string, value: string) => {
    if (type === "recipient") {
      if (value === "Siswa") return styles.badgeSiswa;
      if (value === "Sekolah") return styles.badgeSekolah;
      if (value === "GTK") return styles.badgeGTK;
    }
    if (type === "level") {
      if (value === "Provinsi") return styles.badgeProvinsi;
      if (value === "Nasional") return styles.badgeNasional;
      if (value === "Internasional") return styles.badgeInternasional;
    }
    return "";
  };

  if (loading) {
    return (
      <div className={styles.slideContainer}>
        <div className={styles.header}>
          <h5 className={styles.title}>{getTitle()} - 1 Bulan Terakhir</h5>
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
          <p>Memuat data prestasi...</p>
        </div>
      </div>
    );
  }

  if (prestasi.length === 0) {
    return (
      <div className={styles.slideContainer}>
        <div className={styles.header}>
          <h5 className={styles.title}>{getTitle()} - 1 Bulan Terakhir</h5>
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
          <i className="fas fa-trophy"></i>
          <h3>Belum Ada {getTitle()}</h3>
          <p>Belum ada prestasi yang tercatat dalam 1 bulan terakhir</p>
        </div>
      </div>
    );
  }

  const currentPrestasi = prestasi[currentSlide];

  return (
    <div className={styles.slideContainer}>
      <div className={styles.header}>
        <h5 className={styles.title}>{getTitle()} - 1 Bulan Terakhir</h5>
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
              {currentPrestasi.image ? (
                <img
                  src={currentPrestasi.image}
                  alt={currentPrestasi.name}
                  className={styles.thumbnail}
                />
              ) : (
                <div className={styles.noImage}>
                  <i className="fas fa-image"></i>
                  <p>Tidak ada gambar</p>
                </div>
              )}
            </div>

            {prestasi.length > 1 && (
              <div className={styles.slideIndicators}>
                {prestasi.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${
                      index === currentSlide ? styles.active : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailSection}>
            <h2 className={styles.prestasiName}>{currentPrestasi.name}</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Penyelenggara</span>
                <span className={styles.infoValue}>
                  {currentPrestasi.penyelenggara}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tanggal</span>
                <span className={styles.infoValue}>
                  {formatDate(currentPrestasi.tanggal)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Penerima</span>
                <span
                  className={`${styles.badge} ${getBadgeClass(
                    "recipient",
                    currentPrestasi.recipient_type
                  )}`}
                >
                  {currentPrestasi.recipient_type}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nama Penerima</span>
                <span className={styles.infoValue}>
                  {currentPrestasi.nama_penerima}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tingkat</span>
                <span
                  className={`${styles.badge} ${getBadgeClass(
                    "level",
                    currentPrestasi.level
                  )}`}
                >
                  {currentPrestasi.level}
                </span>
              </div>
            </div>

            <div className={styles.descriptionSection}>
              <h6 className={styles.descriptionLabel}>Deskripsi</h6>
              <p className={styles.description}>
                {currentPrestasi.description}
              </p>
            </div>
          </div>

          <div className={styles.navigationButtons}>
            <Button
              className={styles.btnNav}
              onClick={prevSlide}
              disabled={prestasi.length <= 1}
              title="Sebelumnya"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Button
              className={styles.btnNav}
              onClick={nextSlide}
              disabled={prestasi.length <= 1}
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
