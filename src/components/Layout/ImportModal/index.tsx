"use client";

import { useState, useRef } from "react";
import Modal from "WT/components/Ui/Modal";
import Button from "WT/components/Ui/Button";
import { useImportExcel } from "WT/hooks/useImportExcel";
import { ImportEntityType } from "WT/config/import.config";
import styles from "./ImportModal.module.css";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: ImportEntityType;
  entityLabel: string;
  onSuccess?: () => void;
}

const ImportModal = ({
  isOpen,
  onClose,
  entityType,
  entityLabel,
  onSuccess,
}: ImportModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { importing, importResult, importFile, downloadTemplate, reset } =
    useImportExcel(entityType);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      reset();
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    const success = await importFile(selectedFile);
    if (success && importResult?.failedCount === 0) {
      handleClose();
      onSuccess?.();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Import Data ${entityLabel}`}
      size="large"
    >
      <div className={styles.content}>
        <div className={styles.warning}>
          <h6 className={styles.warningTitle}>
            <i className="fas fa-triangle-exclamation"></i> Warning Import
          </h6>
          <p>Jika ada data yang error semua data tidak akan di tambahkan!</p>
        </div>

        <div className={styles.instructions}>
          <h6 className={styles.instructionTitle}>
            <i className="fas fa-info-circle"></i> Panduan Import
          </h6>
          <ol className={styles.instructionList}>
            <li>Download template Excel dengan klik tombol di bawah</li>
            <li>Isi data sesuai dengan format yang ada di template</li>
            <li>
              Pastikan semua kolom wajib terisi dan format data sudah benar
            </li>
            <li>Upload file Excel yang sudah diisi</li>
            <li>Klik Import untuk memproses data</li>
          </ol>
        </div>

        <div className={styles.templateSection}>
          <Button
            type="button"
            className={styles.btnDownloadTemplate}
            onClick={handleDownloadTemplate}
          >
            <i className="fas fa-download"></i>
            Download Template Excel
          </Button>
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.label}>
            Pilih File Excel <span className={styles.required}>*</span>
          </label>
          <div className={styles.fileInputWrapper}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className={styles.fileInput}
              disabled={importing}
            />
            {selectedFile && (
              <div className={styles.fileInfo}>
                <i className="fas fa-file-excel"></i>
                <span className={styles.fileName}>{selectedFile.name}</span>
                <span className={styles.fileSize}>
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>
        </div>

        {importResult && (
          <div
            className={`${styles.resultSection} ${
              importResult.failedCount > 0 ? styles.hasErrors : styles.success
            }`}
          >
            <h6 className={styles.resultTitle}>
              <i
                className={`fas ${
                  importResult.failedCount > 0
                    ? "fa-exclamation-triangle"
                    : "fa-check-circle"
                }`}
              ></i>
              Hasil Import
            </h6>

            <div className={styles.resultStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Baris:</span>
                <span className={styles.statValue}>
                  {importResult.totalRows}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Berhasil:</span>
                <span className={`${styles.statValue} ${styles.success}`}>
                  {importResult.successCount}
                </span>
              </div>
              {importResult.failedCount > 0 && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Gagal:</span>
                  <span className={`${styles.statValue} ${styles.error}`}>
                    {importResult.failedCount}
                  </span>
                </div>
              )}
            </div>

            {importResult.errors.length > 0 && (
              <div className={styles.errorList}>
                <h6 className={styles.errorTitle}>Detail Error:</h6>
                <div className={styles.errorItems}>
                  {importResult.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className={styles.errorItem}>
                      <span className={styles.errorRow}>Baris {error.row}</span>
                      {error.field && (
                        <span className={styles.errorField}>
                          ({error.field})
                        </span>
                      )}
                      <span className={styles.errorMessage}>
                        : {error.message}
                      </span>
                    </div>
                  ))}
                  {importResult.errors.length > 10 && (
                    <div className={styles.errorMore}>
                      ... dan {importResult.errors.length - 10} error lainnya
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            className={styles.btnCancel}
            onClick={handleClose}
            disabled={importing}
          >
            {importResult && importResult.failedCount === 0 ? "Tutup" : "Batal"}
          </Button>
          <Button
            type="button"
            className={styles.btnImport}
            onClick={handleImport}
            disabled={!selectedFile || importing}
          >
            {importing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Importing...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i>
                Import Data
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
