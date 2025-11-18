"use client";

import { FilterOptionsUser } from "WT/types/user";
import styles from "./UserFilter.module.css";
import Button from "WT/components/Ui/Button";

interface SearchFilterProps {
  filters: FilterOptionsUser;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
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
            placeholder="Cari nama atau email..."
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
              <label>Role</label>
              <select
                value={filters.role}
                onChange={(e) => onFilterChange("role", e.target.value)}
              >
                <option value="">Semua Role</option>
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="PRINCIPAL">Principal</option>
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
