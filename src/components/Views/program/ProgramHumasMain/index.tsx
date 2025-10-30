"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import { useProgram } from "WT/hooks/useProgram";
import ProgramSlide from "WT/components/Layout/Program/ProgramSlide";
import ProgramList from "WT/components/Layout/Program/ProgramList";

interface ProgramHumasMainProps {
  user: SessionUser | null | undefined;
}

const ProgramHumasMain = ({ user }: ProgramHumasMainProps) => {
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
  } = useProgram("Humas");

  const handleAddClick = () => {
    router.push("/program/humas/tambah");
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
      <ProgramList user={user} onBack={handleBackToSlide} tipeProgram="Humas" />
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
      title="Program Hubungan Masyarakat"
    />
  );
};

export default ProgramHumasMain;
