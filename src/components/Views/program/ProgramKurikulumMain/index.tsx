"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import { useProgram } from "WT/hooks/useProgram";
import ProgramSlide from "WT/components/Layout/Program/ProgramSlide";
import ProgramList from "WT/components/Layout/Program/ProgramList";

interface ProgramKurikulumMainProps {
  user: SessionUser | null | undefined;
}

const ProgramKurikulumMain = ({ user }: ProgramKurikulumMainProps) => {
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
  } = useProgram("Kurikulum");

  const handleAddClick = () => {
    router.push("/program/kurikulum/tambah");
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
        tipeProgram="Kurikulum"
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
      title="Program Kurikulum"
    />
  );
};

export default ProgramKurikulumMain;
