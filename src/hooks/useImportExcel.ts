import { useState } from "react";
import { toast } from "react-toastify";
import { ImportEntityType } from "WT/config/import.config";
import { ImportResult } from "WT/types/import";

interface UseImportExcelReturn {
  importing: boolean;
  importResult: ImportResult | null;
  importFile: (file: File) => Promise<boolean>;
  downloadTemplate: () => Promise<void>;
  reset: () => void;
}

export const useImportExcel = (
  entityType: ImportEntityType
): UseImportExcelReturn => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const importFile = async (file: File): Promise<boolean> => {
    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/import/${entityType}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImportResult(data.result);

        if (data.result.failedCount > 0) {
          toast.warning(
            `Import selesai dengan ${data.result.successCount} sukses dan ${data.result.failedCount} gagal`
          );
        } else {
          toast.success(data.message);
        }

        return true;
      } else {
        setImportResult(data.result);
        toast.error(data.message || "Gagal import data");
        return false;
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Terjadi kesalahan saat import data");
      return false;
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`/api/import/${entityType}/template`);

      if (!response.ok) {
        throw new Error("Gagal download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Template_Import_${entityType}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Template berhasil didownload");
    } catch (error) {
      console.error("Download template error:", error);
      toast.error("Gagal download template");
    }
  };

  const reset = () => {
    setImportResult(null);
  };

  return {
    importing,
    importResult,
    importFile,
    downloadTemplate,
    reset,
  };
};
