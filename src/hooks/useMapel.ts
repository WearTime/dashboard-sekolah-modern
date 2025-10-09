import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Mapel,
  FilterOptionsMapel,
  MapelWithRelations,
  MapelGuruRelation,
} from "WT/types/mapel";
import { useDebounce } from "WT/hooks/useDebounce";
import { PaginationData } from "WT/types";
import { Guru } from "WT/types/teacher";

interface UseMapelReturn {
  mapel: Mapel[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterOptionsMapel;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptionsMapel>>;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;

  availableGuru: Guru[];
  loadingGuru: boolean;
  fetchAvailableGuru: () => Promise<void>;
  fetchMapelGuru: (nip: string) => Promise<MapelGuruRelation[]>;
}

export const useMapel = (): UseMapelReturn => {
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterOptionsMapel>({
    search: "",
    tipe_mapel: "",
    jurusan: "",
  });

  const [availableGuru, setAvailableGuru] = useState<Guru[]>([]);
  const [loadingGuru, setLoadingGuru] = useState(false);

  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchMapel = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.tipe_mapel && { tipe_mapel: filters.tipe_mapel }),
        ...(filters.jurusan && { jurusan: filters.jurusan }),
      });

      const res = await fetch(`/api/mapel?${params}`);
      const data = await res.json();

      if (data.success) {
        setMapel(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        toast.error(data.message || "Gagal mengambil data mapel");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.tipe_mapel, filters.jurusan]);

  const fetchAvailableGuru = useCallback(async () => {
    setLoadingGuru(true);
    try {
      const res = await fetch("/api/guru?limit=1000");
      const data = await res.json();

      if (data.success) {
        setAvailableGuru(data.data);
      } else {
        toast.error("Gagal memuat data mata pelajaran");
      }
    } catch (error) {
      console.error("Error fetching mapel:", error);
      toast.error("Gagal memuat data mata pelajaran");
    } finally {
      setLoadingGuru(false);
    }
  }, []);

  const fetchMapelGuru = useCallback(
    async (kode_mapel: string): Promise<MapelGuruRelation[]> => {
      try {
        const res = await fetch(`/api/mapel/${kode_mapel}/guru`);
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
    fetchMapel();
  }, [fetchMapel]);

  return {
    mapel,
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
    refreshData: fetchMapel,

    availableGuru,
    loadingGuru,
    fetchAvailableGuru,
    fetchMapelGuru,
  };
};
