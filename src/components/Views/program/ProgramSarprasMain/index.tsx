"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import { useProgram } from "WT/hooks/useProgram";
import ProgramSlide from "WT/components/Layout/Program/ProgramSlide";
import ProgramList from "WT/components/Layout/Program/ProgramList";

interface ProgramSarprasMainProps {
  user: SessionUser | null | undefined;
}

const ProgramSarprasMain = ({ user }: ProgramSarprasMainProps) => {
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
  } = useProgram("Sarpras");

  const handleAddClick = () => {
    router.push("/program/sarpras/tambah");
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
      <ProgramList
        user={user}
        onBack={handleBackToSlide}
        tipeProgram="Sarpras"
      />
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
      title="Program Sarana dan Prasarana"
    />
  );
};

export default ProgramSarprasMain;
