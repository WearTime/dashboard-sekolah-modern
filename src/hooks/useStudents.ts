import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Siswa, FilterOptions, PaginationData } from "WT/types/student";
import { useDebounce } from "WT/hooks/useDebounce";

interface UseStudentsReturn {
  students: Siswa[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;
}

export const useStudents = (): UseStudentsReturn => {
  const [students, setStudents] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    kelas: "",
    jurusan: "",
    jenis_kelamin: "",
  });

  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.kelas && { kelas: filters.kelas }),
        ...(filters.jurusan && { jurusan: filters.jurusan }),
      });

      const res = await fetch(`/api/siswa?${params}`);
      const data = await res.json();

      if (data.success) {
        setStudents(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        toast.error(data.message || "Gagal mengambil data siswa");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.kelas, filters.jurusan]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
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
    refreshData: fetchStudents,
  };
};
