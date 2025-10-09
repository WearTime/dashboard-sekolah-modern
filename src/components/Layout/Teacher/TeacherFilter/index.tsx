"use client";

import styles from "./TeacherFilter.module.css";
import Button from "WT/components/Ui/Button";
import { FilterOptionsGuru } from "WT/types/teacher";

interface SearchFilterProps {
  filters: FilterOptionsGuru;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof FilterOptionsGuru, value: string) => void;
  onToggleFilter: () => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
}

const SearchFilter = ({
  filters,
  showFilter,
  onSearchChange,
  onFilterChange,
  onToggleFilter,
  onApplyFilter,
  onResetFilter,
}: SearchFilterProps) => {
  return (
    <>
      <div className={styles.filterSearchContainer}>
        <div className={styles.searchBox}>
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama siswa atau NIP..."
          />
          {filters.search && (
            <i
              className={styles.clearIcon}
              onClick={() => onSearchChange("")}
            ></i>
          )}
        </div>
        <Button className={styles.filterBtn} onClick={onToggleFilter}>
          <i className="fas fa-filter"></i>
          <span>Filter</span>
        </Button>
      </div>

      {showFilter && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Jenis Kelamin</label>
              <select
                value={filters.jenis_kelamin}
                onChange={(e) =>
                  onFilterChange("jenis_kelamin", e.target.value)
                }
              >
                <option value="">Semua Jenis Kelamin</option>
                <option value="L">Laki Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Honorer">Honorer</option>
                <option value="P3K">P3K</option>
                <option value="ASN">ASN</option>
              </select>
            </div>
          </div>
          <div className={styles.filterActions}>
            <Button className={styles.btnReset} onClick={onResetFilter}>
              Reset
            </Button>
            <Button className={styles.btnApply} onClick={onApplyFilter}>
              Terapkan
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchFilter;
