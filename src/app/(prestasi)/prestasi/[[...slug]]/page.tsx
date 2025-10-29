import { notFound } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import PrestasiMain from "WT/components/Views/prestasi/PrestasiMain";
import { getCurrentUser } from "WT/lib/auth";
import { redirect, forbidden } from "next/navigation";
import { hasPermission } from "WT/lib/permissions";
import TambahPrestasi from "WT/components/Views/prestasi/PrestasiAdd";

type PrestasiType = "siswa" | "sekolah" | "gtk";
type LevelType = "provinsi" | "nasional" | "internasional";

const validTypes: PrestasiType[] = ["siswa", "sekolah", "gtk"];
const validLevels: LevelType[] = ["provinsi", "nasional", "internasional"];

const typeLabels = {
  siswa: "Siswa",
  sekolah: "Sekolah",
  gtk: "GTK",
} as const;

const levelLabels = {
  provinsi: "Provinsi",
  nasional: "Nasional",
  internasional: "Internasional",
} as const;

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];

  if (slug.length === 0) {
    return {
      title: "Prestasi - SMK N 4 Bandar Lampung",
      description: "Prestasi sistem manajemen sekolah",
    };
  }

  const [type, level] = slug.map((s) => s.toLowerCase());

  if (type === "tambah") {
    return {
      title: "Tambah Prestasi - SMK N 4 Bandar Lampung",
      description: "Tambah Prestasi sistem manajemen sekolah",
    };
  }

  if (!validTypes.includes(type as PrestasiType)) {
    return { title: "Halaman tidak ditemukan" };
  }

  if (type === "gtk" && level && validLevels.includes(level as LevelType)) {
    return {
      title: `Prestasi GTK ${
        levelLabels[level as LevelType]
      } - SMK N 4 Bandar Lampung`,
      description: `Prestasi GTK tingkat ${
        levelLabels[level as LevelType]
      } sistem manajemen sekolah`,
    };
  }

  if (type === "gtk" && level) {
    return { title: "Halaman tidak ditemukan" };
  }

  return {
    title: `Prestasi ${
      typeLabels[type as PrestasiType]
    } - SMK N 4 Bandar Lampung`,
    description: `Prestasi ${
      typeLabels[type as PrestasiType]
    } sistem manajemen sekolah`,
  };
}

export default async function PrestasiPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug ?? [];
  const [type, level] = slug.map((s) => s.toLowerCase());
  const user = await getCurrentUser();
  const queryType = (
    resolvedSearchParams?.type as string | undefined
  )?.toLowerCase();
  const queryLevel = (
    resolvedSearchParams?.level as string | undefined
  )?.toLowerCase();

  if (slug.length === 0) {
    notFound();
  }

  if (type === "tambah") {
    if (!user) redirect("/login");

    const recipient_type = queryType || " ";
    const recipient_level = queryLevel;

    let permissionName = "";
    if (recipient_type === "siswa") {
      permissionName = "prestasi.siswa.create";
    } else if (recipient_type === "sekolah") {
      permissionName = "prestasi.sekolah.create";
    } else if (recipient_type === "gtk") {
      if (
        recipient_level &&
        validLevels.includes(recipient_level as LevelType)
      ) {
        permissionName = `prestasi.gtk.${recipient_level}.create`;
      } else {
        forbidden();
      }
    } else {
      forbidden();
    }

    const userPermis = await hasPermission(user.id, permissionName);
    if (!userPermis) forbidden();

    return (
      <MainLayout
        pageTitle={`Tambah Prestasi ${recipient_type.toUpperCase()}${
          recipient_type === "gtk" && recipient_level
            ? ` (${recipient_level.toUpperCase()})`
            : ""
        }`}
        user={user}
      >
        <TambahPrestasi />
      </MainLayout>
    );
  }

  if (validTypes.includes(type as PrestasiType)) {
    if (type === "gtk" && level) {
      if (!validLevels.includes(level as LevelType)) notFound();

      return (
        <MainLayout
          pageTitle={`Prestasi GTK ${levelLabels[level as LevelType]}`}
          user={user}
        >
          <PrestasiMain
            user={user}
            prestasiType="GTK"
            level={levelLabels[level as LevelType]}
          />
        </MainLayout>
      );
    }

    return (
      <MainLayout
        pageTitle={`Prestasi ${typeLabels[type as PrestasiType]}`}
        user={user}
      >
        <PrestasiMain
          user={user}
          prestasiType={typeLabels[type as PrestasiType]}
        />
      </MainLayout>
    );
  }

  notFound();
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];

  params.push({ slug: [] });
  params.push({ slug: ["tambah"] });
  validTypes.forEach((type) => params.push({ slug: [type] }));
  validLevels.forEach((level) => params.push({ slug: ["gtk", level] }));

  return params;
}
