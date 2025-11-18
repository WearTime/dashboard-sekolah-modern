"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import { TipeProgram } from "WT/types/program";
import { useProgram } from "WT/hooks/useProgram";
import ProgramSlide from "WT/components/Layout/Program/ProgramSlide";
import ProgramList from "WT/components/Layout/Program/ProgramList";

interface ProgramMainProps {
  user: SessionUser | null | undefined;
  tipeProgram: TipeProgram;
  title: string;
}

const ProgramMain = ({ user, tipeProgram, title }: ProgramMainProps) => {
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
  } = useProgram(tipeProgram);

  const handleAddClick = () => {
    router.push(`/program/${tipeProgram.toLowerCase()}/tambah`);
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
        tipeProgram={tipeProgram}
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
      title={title}
      user={user}
      tipeProgram={tipeProgram}
    />
  );
};

export default ProgramMain;
