"use client";

import styles from "./MapelFilter.module.css";
import Button from "WT/components/Ui/Button";
import { FilterOptionsMapel } from "WT/types/mapel";

interface SearchFilterProps {
  filters: FilterOptionsMapel;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof FilterOptionsMapel, value: string) => void;
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
            placeholder="Cari nama Mapel atau Kode Mapel..."
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
              <label>Tipe Mapel</label>
              <select
                value={filters.tipe_mapel}
                onChange={(e) => onFilterChange("tipe_mapel", e.target.value)}
              >
                <option value="">Semua Tipe Mapel</option>
                <option value="Umum">Umum</option>
                <option value="Jurusan">Jurusan</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Jurusan</label>
              <select
                value={filters.jurusan}
                onChange={(e) => onFilterChange("jurusan", e.target.value)}
              >
                <option value="">Semua Jurusan</option>
                <option value="PPLG">PPLG</option>
                <option value="TKJT">TKJT</option>
                <option value="DKV">DKV</option>
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
