"use client";

import { ProgramJurusan, Jurusan } from "WT/types/program";
import styles from "../ProgramSlide/ProgramSlide.module.css";
import Button from "WT/components/Ui/Button";

interface SlideViewProps {
  programs: ProgramJurusan[];
  loading: boolean;
  currentSlide: number;
  onNext: () => void;
  onPrev: () => void;
  onSlideChange: (index: number) => void;
  onAddClick: () => void;
  onListClick: () => void;
  title: string;
  jurusan: Jurusan;
}

const ProgramJurusanSlide = ({
  programs,
  loading,
  currentSlide,
  onNext,
  onPrev,
  onSlideChange,
  onAddClick,
  onListClick,
  title,
}: SlideViewProps) => {
  if (loading) {
    return (
      <div className={styles.slideContainer}>
        <div className={styles.header}>
          <h5 className={styles.title}>{title}</h5>
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
          <p>Memuat data program...</p>
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className={styles.slideContainer}>
        <div className={styles.header}>
          <h5 className={styles.title}>{title}</h5>
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
          <i className="fas fa-folder-open"></i>
          <h3>Belum Ada Data Program</h3>
          <p>Klik tombol &quot;Tambah&quot; untuk menambahkan program baru</p>
        </div>
      </div>
    );
  }

  const currentProgram = programs[currentSlide];

  return (
    <div className={styles.slideContainer}>
      <div className={styles.header}>
        <h5 className={styles.title}>{title}</h5>
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
              {currentProgram.thumbnail ? (
                <img
                  src={currentProgram.thumbnail}
                  alt={currentProgram.judul}
                  className={styles.thumbnail}
                />
              ) : (
                <div className={styles.noImage}>
                  <i className="fas fa-image"></i>
                  <p>Tidak ada gambar</p>
                </div>
              )}
            </div>

            {programs.length > 1 && (
              <div className={styles.slideIndicators}>
                {programs.map((_, index) => (
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

          <div className={styles.descriptionSection}>
            <h2 className={styles.programTitle}>{currentProgram.judul}</h2>
            <p className={styles.description}>{currentProgram.deskripsi}</p>
          </div>

          <div className={styles.navigationButtons}>
            <Button
              className={styles.btnNav}
              onClick={onPrev}
              disabled={programs.length <= 1}
              title="Sebelumnya"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Button
              className={styles.btnNav}
              onClick={onNext}
              disabled={programs.length <= 1}
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

export default ProgramJurusanSlide;
