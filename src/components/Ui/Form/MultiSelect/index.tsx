"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../Form.module.css";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  placeholder?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  loading?: boolean;
  searchable?: boolean;
}

const MultiSelect = ({
  label,
  placeholder = "Pilih opsi",
  options,
  selectedValues,
  onChange,
  loading = false,
  searchable = true,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedLabels = () => {
    return options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);
  };

  if (loading) {
    return (
      <div className={styles.formGroup}>
        <label className={styles.label}>{label}</label>
        <div className={styles.loadingState}>
          <i className="fas fa-spinner fa-spin"></i> Memuat data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.multiSelectWrapper} ref={dropdownRef}>
        <div
          className={styles.multiSelectInput}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedValues.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            <div className={styles.selectedTags}>
              {getSelectedLabels().map((label, idx) => (
                <span key={idx} className={styles.tag}>
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(selectedValues[idx]);
                    }}
                    className={styles.tagRemove}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <i className={`fas fa-chevron-down ${styles.dropdownIcon}`}></i>
        </div>

        {isOpen && (
          <div className={styles.multiSelectDropdown}>
            {searchable && (
              <div className={styles.dropdownSearch}>
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className={styles.dropdownList}>
              {filteredOptions.length === 0 ? (
                <div className={styles.noResults}>
                  {searchTerm ? "Tidak ada hasil" : "Belum ada data"}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <label key={option.value} className={styles.dropdownItem}>
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
