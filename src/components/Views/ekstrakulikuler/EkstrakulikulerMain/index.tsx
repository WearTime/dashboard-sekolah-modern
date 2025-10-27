"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "WT/types";
import EkstrakulikulerList from "WT/components/Views/ekstrakulikuler/EkstrakulikulerList";
import { useEkstrakulikuler } from "WT/hooks/useEkstrakulikuler";
import SlideView from "WT/components/Layout/Ekstrakulikuler/EkstrakulikulerSlide/EkstrakulikulerSlide";

interface EkstrakulikulerMainProps {
  user: SessionUser | null | undefined;
}

const EkstrakulikulerMain = ({ user }: EkstrakulikulerMainProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"slide" | "list">("slide");

  const {
    ekstrakulikuler,
    loading,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    refreshData,
  } = useEkstrakulikuler();

  const handleAddClick = () => {
    router.push("/ekstrakulikuler/tambah");
  };

  const handleListClick = () => {
    setViewMode("list");
  };

  const handleBackToSlide = () => {
    setViewMode("slide");
    refreshData();
  };

  if (viewMode === "list") {
    return <EkstrakulikulerList user={user} onBack={handleBackToSlide} />;
  }

  return (
    <SlideView
      ekstrakulikuler={ekstrakulikuler}
      loading={loading}
      currentSlide={currentSlide}
      onNext={nextSlide}
      onPrev={prevSlide}
      onSlideChange={setCurrentSlide}
      onAddClick={handleAddClick}
      onListClick={handleListClick}
    />
  );
};

export default EkstrakulikulerMain;