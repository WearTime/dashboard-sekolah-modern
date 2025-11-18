"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import { Jurusan } from "WT/types/program";
import ProgramJurusanList from "WT/components/Layout/Program/ProgramJurusanList";
import { useProgramJurusan } from "WT/hooks/useProgramJurusan";
import ProgramJurusanSlide from "WT/components/Layout/Program/ProgramJurusanSlide";

interface ProgramJurusanMainProps {
  user: SessionUser | null | undefined;
  jurusan: Jurusan;
}

const ProgramJurusanMain = ({ user, jurusan }: ProgramJurusanMainProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"slide" | "list">("slide");

  const {
    programs,
    loading,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    refreshData,
  } = useProgramJurusan(jurusan.kode);

  const handleAddClick = () => {
    router.push(`/program/jurusan/${jurusan.kode.toLowerCase()}/tambah`);
  };

  const handleListClick = () => {
    setViewMode("list");
  };

  const handleBackToSlide = () => {
    setViewMode("slide");
    refreshData();
  };

  if (viewMode === "list") {
    return (
      <ProgramJurusanList
        user={user}
        onBack={handleBackToSlide}
        jurusan={jurusan}
      />
    );
  }

  return (
    <ProgramJurusanSlide
      programs={programs}
      loading={loading}
      currentSlide={currentSlide}
      onNext={nextSlide}
      onPrev={prevSlide}
      onSlideChange={setCurrentSlide}
      onAddClick={handleAddClick}
      onListClick={handleListClick}
      title={`Program ${jurusan.nama}`}
      jurusan={jurusan}
      user={user}
    />
  );
};

export default ProgramJurusanMain;
