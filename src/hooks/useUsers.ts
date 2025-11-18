import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { User, FilterOptionsUser, Permission } from "WT/types/user";
import { useDebounce } from "WT/hooks/useDebounce";
import { PaginationData } from "WT/types";

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  pagination: PaginationData;
  filters: FilterOptionsUser;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptionsUser>>;
  setCurrentPage: (page: number) => void;
  refreshData: () => void;

  permissions: Permission[];
  loadingPermissions: boolean;
  fetchPermissions: () => Promise<void>;

  rolePermissions: Record<string, string[]>;
  loadingRolePermissions: boolean;
  fetchRolePermissions: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterOptionsUser>({
    search: "",
    role: "",
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  const [rolePermissions, setRolePermissions] = useState<
    Record<string, string[]>
  >({});
  const [loadingRolePermissions, setLoadingRolePermissions] = useState(false);

  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.role && { role: filters.role }),
      });

      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        toast.error(data.message || "Gagal mengambil data users");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.role]);

  const fetchPermissions = useCallback(async () => {
    setLoadingPermissions(true);
    try {
      const res = await fetch("/api/permissions?limit=1000");
      const data = await res.json();

      if (data.success) {
        setPermissions(data.data);
      } else {
        toast.error("Gagal memuat data permissions");
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Gagal memuat data permissions");
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  const fetchRolePermissions = useCallback(async () => {
    setLoadingRolePermissions(true);
    try {
      const res = await fetch("/api/role-permissions");
      const data = await res.json();

      if (data.success) {
        setRolePermissions(data.data);
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    } finally {
      setLoadingRolePermissions(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
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
    refreshData: fetchUsers,

    permissions,
    loadingPermissions,
    fetchPermissions,

    rolePermissions,
    loadingRolePermissions,
    fetchRolePermissions,
  };
};
