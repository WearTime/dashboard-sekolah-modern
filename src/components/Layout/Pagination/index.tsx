"use client";

import Button from "WT/components/Ui/Button";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.showingInfo}>
        Menampilkan <strong>{(currentPage - 1) * itemsPerPage + 1}</strong>{" "}
        sampai <strong>{Math.min(currentPage * itemsPerPage, total)}</strong>{" "}
        dari <strong>{total}</strong> data
      </div>
      <div className={styles.pagination}>
        <Button
          className={styles.pageBtn}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </Button>
        {pageNumbers.map((page, idx, arr) => {
          if (idx > 0 && arr[idx - 1] !== page - 1) {
            return (
              <span key={`dots-${page}`} style={{ padding: "0 8px" }}>
                ...
              </span>
            );
          }
          return (
            <Button
              key={page}
              className={`${styles.pageBtn} ${
                page === currentPage ? styles.active : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}
        <Button
          className={styles.pageBtn}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-chevron-right"></i>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
