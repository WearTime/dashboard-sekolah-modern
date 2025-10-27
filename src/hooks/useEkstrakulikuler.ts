import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Ekstrakulikuler,
  FilterEkstrakulikulerOptions,
} from "WT/types/ekstrakulikuler";
import { useDebounce } from "WT/hooks/useDebounce";
import { PaginationData } from "WT/types";

interface UseEkstrakulikulerReturn {
  ekstrakulikuler: Ekstrakulikuler[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterEkstrakulikulerOptions;
  setFilters: React.Dispatch<
    React.SetStateAction<FilterEkstrakulikulerOptions>
  >;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useEkstrakulikuler = (): UseEkstrakulikulerReturn => {
  const [ekstrakulikuler, setEkstrakulikuler] = useState<Ekstrakulikuler[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState<FilterEkstrakulikulerOptions>({
    search: "",
  });

  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchEkstrakulikuler = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const res = await fetch(`/api/ekstrakulikuler?${params}`);
      const data = await res.json();

      if (data.success) {
        setEkstrakulikuler(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        if (data.data.length > 0) {
          setCurrentSlide(0);
        }
      } else {
        toast.error(data.message || "Gagal mengambil data ekstrakulikuler");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchEkstrakulikuler();
  }, [fetchEkstrakulikuler]);

  const nextSlide = useCallback(() => {
    if (ekstrakulikuler.length > 0) {
      setCurrentSlide((prev) =>
        prev === ekstrakulikuler.length - 1 ? 0 : prev + 1
      );
    }
  }, [ekstrakulikuler.length]);

  const prevSlide = useCallback(() => {
    if (ekstrakulikuler.length > 0) {
      setCurrentSlide((prev) =>
        prev === 0 ? ekstrakulikuler.length - 1 : prev - 1
      );
    }
  }, [ekstrakulikuler.length]);

  return {
    ekstrakulikuler,
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
    refreshData: fetchEkstrakulikuler,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
  };
};
