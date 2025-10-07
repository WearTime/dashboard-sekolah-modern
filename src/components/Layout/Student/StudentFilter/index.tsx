"use client";

import { FilterOptions } from "WT/types/student";
import styles from "./StudentFilter.module.css";
import Button from "WT/components/Ui/Button";

interface SearchFilterProps {
  filters: FilterOptions;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
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
            placeholder="Cari nama siswa atau NISN..."
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
              <label>Kelas</label>
              <select
                value={filters.kelas}
                onChange={(e) => onFilterChange("kelas", e.target.value)}
              >
                <option value="">Semua Kelas</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Jurusan</label>
              <select
                value={filters.jurusan}
                onChange={(e) => onFilterChange("jurusan", e.target.value)}
              >
                <option value="">Semua Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
                <option value="MM">Multimedia</option>
                <option value="AKL">Akuntansi</option>
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
