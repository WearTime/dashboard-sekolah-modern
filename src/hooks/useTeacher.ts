import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Guru, FilterOptionsGuru } from "WT/types/teacher";
import { useDebounce } from "WT/hooks/useDebounce";
import { PaginationData } from "WT/types";

interface Mapel {
  kode_mapel: string;
  nama_mapel: string;
  fase: string;
  tipe_mapel: string;
  jurusan: string;
}

interface GuruMapelRelation {
  id: string;
  kode_mapel: string;
  nip_guru: string;
  mapel: {
    kode_mapel: string;
    nama_mapel: string;
    fase: string;
    tipe_mapel: string;
    jurusan: string;
  };
}

interface UseTeachersReturn {
  teachers: Guru[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterOptionsGuru;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptionsGuru>>;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;

  availableMapel: Mapel[];
  loadingMapel: boolean;
  fetchAvailableMapel: () => Promise<void>;
  fetchGuruMapel: (nip: string) => Promise<GuruMapelRelation[]>;
}

export const useTeachers = (): UseTeachersReturn => {
  const [teachers, setTeachers] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterOptionsGuru>({
    search: "",
    status: "",
    jenis_kelamin: "",
  });

  const [availableMapel, setAvailableMapel] = useState<Mapel[]>([]);
  const [loadingMapel, setLoadingMapel] = useState(false);

  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.status && { status: filters.status }),
        ...(filters.jenis_kelamin && { jenis_kelamin: filters.jenis_kelamin }),
      });

      const res = await fetch(`/api/guru?${params}`);
      const data = await res.json();

      if (data.success) {
        setTeachers(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        toast.error(data.message || "Gagal mengambil data guru");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.status, filters.jenis_kelamin]);

  const fetchAvailableMapel = useCallback(async () => {
    setLoadingMapel(true);
    try {
      const res = await fetch("/api/mapel?limit=1000");
      const data = await res.json();

      if (data.success) {
        setAvailableMapel(data.data);
      } else {
        toast.error("Gagal memuat data mata pelajaran");
      }
    } catch (error) {
      console.error("Error fetching mapel:", error);
      toast.error("Gagal memuat data mata pelajaran");
    } finally {
      setLoadingMapel(false);
    }
  }, []);

  const fetchGuruMapel = useCallback(
    async (nip: string): Promise<GuruMapelRelation[]> => {
      try {
        const res = await fetch(`/api/guru/${nip}/mapel`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.error("Error fetching guru mapel:", error);
        toast.error("Gagal memuat data mata pelajaran guru");
        return [];
      }
    },
    []
  );

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
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
    refreshData: fetchTeachers,

    availableMapel,
    loadingMapel,
    fetchAvailableMapel,
    fetchGuruMapel,
  };
};
