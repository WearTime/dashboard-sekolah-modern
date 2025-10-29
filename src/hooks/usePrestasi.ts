import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Prestasi, FilterPrestasiOptions } from "WT/types/prestasi";
import { useDebounce } from "WT/hooks/useDebounce";
import { PaginationData } from "WT/types";

interface UsePrestasiReturn {
  prestasi: Prestasi[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterPrestasiOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterPrestasiOptions>>;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  prestasiByType: {
    siswa: Prestasi[];
    sekolah: Prestasi[];
    gtk: Prestasi[];
  };
}

export const usePrestasi = (
  prestasiType?: "Siswa" | "Sekolah" | "GTK",
  level?: "Provinsi" | "Nasional" | "Internasional"
): UsePrestasiReturn => {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState<FilterPrestasiOptions>({
    search: "",
    recipient_type: "",
    level: "",
  });

  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchPrestasi = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.recipient_type && {
          recipient_type: filters.recipient_type,
        }),
        ...(filters.level && { level: filters.level }),
        ...(prestasiType && { recipient_type: prestasiType }),
        ...(level && { level }),
      });

      const res = await fetch(`/api/prestasi?${params}`);
      const data = await res.json();

      if (data.success) {
        setPrestasi(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        if (data.data.length > 0) {
          setCurrentSlide(0);
        }
      } else {
        toast.error(data.message || "Gagal mengambil data prestasi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    filters.recipient_type,
    filters.level,
    prestasiType,
    level,
  ]);

  useEffect(() => {
    fetchPrestasi();
  }, [fetchPrestasi]);

  const nextSlide = useCallback(() => {
    if (prestasi.length > 0) {
      setCurrentSlide((prev) => (prev === prestasi.length - 1 ? 0 : prev + 1));
    }
  }, [prestasi.length]);

  const prevSlide = useCallback(() => {
    if (prestasi.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? prestasi.length - 1 : prev - 1));
    }
  }, [prestasi.length]);

  const prestasiByType = {
    siswa: prestasi.filter((p) => p.recipient_type === "Siswa"),
    sekolah: prestasi.filter((p) => p.recipient_type === "Sekolah"),
    gtk: prestasi.filter((p) => p.recipient_type === "GTK"),
  };

  return {
    prestasi,
    loading,
    pagination: {
      totalPages,
      total,
      currentPage,
      limit: itemsPerPage,
    },
    filters,
    setFilters,
    setCurrentPage,
    refreshData: fetchPrestasi,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    prestasiByType,
  };
};
