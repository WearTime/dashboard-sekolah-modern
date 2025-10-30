"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import { useProgram } from "WT/hooks/useProgram";
import ProgramSlide from "WT/components/Layout/Program/ProgramSlide";
import ProgramList from "WT/components/Layout/Program/ProgramList";

interface ProgramSiswaMainProps {
  user: SessionUser | null | undefined;
}

const ProgramSiswaMain = ({ user }: ProgramSiswaMainProps) => {
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
  } = useProgram("Siswa");

  const handleAddClick = () => {
    router.push("/program/siswa/tambah");
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
      <ProgramList user={user} onBack={handleBackToSlide} tipeProgram="Siswa" />
    );
  }

  return (
    <ProgramSlide
      programs={programs}
      loading={loading}
      currentSlide={currentSlide}
      onNext={nextSlide}
      onPrev={prevSlide}
      onSlideChange={setCurrentSlide}
      onAddClick={handleAddClick}
      onListClick={handleListClick}
      title="Program Kesiswaan"
    />
  );
};

export default ProgramSiswaMain;
