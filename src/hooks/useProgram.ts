import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  ProgramSekolah,
  FilterProgramOptions,
  TipeProgram,
} from "WT/types/program";
import { useDebounce } from "WT/hooks/useDebounce";
import { PaginationData } from "WT/types";

interface UseProgramReturn {
  programs: ProgramSekolah[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterProgramOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterProgramOptions>>;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useProgram = (tipeProgram?: TipeProgram): UseProgramReturn => {
  const [programs, setPrograms] = useState<ProgramSekolah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState<FilterProgramOptions>({
    search: "",
    tipe_program: "",
  });

  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.tipe_program && { tipe_program: filters.tipe_program }),
        ...(tipeProgram && { tipe_program: tipeProgram }),
      });

      const res = await fetch(`/api/program?${params}`);
      const data = await res.json();

      if (data.success) {
        setPrograms(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        if (data.data.length > 0) {
          setCurrentSlide(0);
        }
      } else {
        toast.error(data.message || "Gagal mengambil data program");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.tipe_program, tipeProgram]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const nextSlide = useCallback(() => {
    if (programs.length > 0) {
      setCurrentSlide((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
    }
  }, [programs.length]);

  const prevSlide = useCallback(() => {
    if (programs.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
    }
  }, [programs.length]);

  return {
    programs,
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
    refreshData: fetchPrograms,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
  };
};
