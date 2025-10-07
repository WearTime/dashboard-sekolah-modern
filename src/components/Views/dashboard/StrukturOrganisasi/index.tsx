"use client";

import Image from "next/image";

const StrukturOrganisasi = () => {
  return (
    <Image
      src="/StrukturOrganisasi.png"
      alt="Struktur Organisasi"
      width={1200}
      height={650}
      style={{ width: "100%", height: "auto" }}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
      priority
    />
  );
};

export default StrukturOrganisasi;
