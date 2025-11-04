"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import PrestasiList from "WT/components/Views/prestasi/PrestasiList";
import { toast } from "react-toastify";
import { Prestasi } from "WT/types/prestasi";
import SlideView from "WT/components/Layout/Prestasi/PrestasiSlide";

interface PrestasiMainProps {
  user: SessionUser | null | undefined;
  prestasiType: "Siswa" | "Sekolah" | "GTK";
  level?: "Provinsi" | "Nasional" | "Internasional";
}

const PrestasiMain = ({ user, prestasiType, level }: PrestasiMainProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"slide" | "list">("slide");
  const [loading, setLoading] = useState(true);
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);

  const fetchPrestasiLastMonth = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lastMonth: "true",
        limit: "1000",
        recipient_type: prestasiType,
        ...(level && { level }),
      });

      const res = await fetch(`/api/prestasi?${params}`);
      const data = await res.json();

      if (data.success) {
        setPrestasi(data.data as Prestasi[]);
      } else {
        toast.error(data.message || "Gagal mengambil data prestasi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "slide") {
      fetchPrestasiLastMonth();
    }
  }, [viewMode, prestasiType, level]);

  const handleAddClick = () => {
    const typeParam = prestasiType.toLowerCase();
    const levelParam = level ? `&level=${level.toLowerCase()}` : "";
    router.push(`/prestasi/tambah?type=${typeParam}${levelParam}`);
  };

  const handleListClick = () => {
    setViewMode("list");
  };

  const handleBackToSlide = () => {
    setViewMode("slide");
    fetchPrestasiLastMonth();
  };

  if (viewMode === "list") {
    return (
      <PrestasiList
        user={user}
        onBack={handleBackToSlide}
        prestasiType={prestasiType}
        level={level}
      />
    );
  }

  return (
    <SlideView
      prestasi={prestasi}
      loading={loading}
      onAddClick={handleAddClick}
      onListClick={handleListClick}
      prestasiType={prestasiType}
      level={level}
    />
  );
};

export default PrestasiMain;
