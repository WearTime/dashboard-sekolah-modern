import MainLayout from "WT/components/Layout/Main";
import EkstrakulikulerDetail from "WT/components/Views/ekstrakulikuler/EkstrakulikulerDetail";
import { getCurrentUser } from "WT/lib/auth";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Ekstrakulikuler } from "WT/types/ekstrakulikuler";

const prisma = new PrismaClient();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eskul = await prisma.ekstrakulikuler.findUnique({
    where: { slug },
  });

  return {
    title: eskul
      ? `${eskul.namaEskul} - SMK N 4 Bandar Lampung`
      : "Ekstrakulikuler - SMK N 4 Bandar Lampung",
    description: eskul?.description || "Detail ekstrakulikuler",
  };
}

export default async function EkstrakulikulerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  const { slug } = await params;

  const eskulData = await prisma.ekstrakulikuler.findUnique({
    where: { slug },
    include: {
      galleries: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!eskulData) {
    notFound();
  }

  const eskul: Ekstrakulikuler = {
    id: eskulData.id,
    namaEskul: eskulData.namaEskul,
    pendamping: eskulData.pendamping,
    ketua: eskulData.ketua,
    description: eskulData.description,
    imagesThumbnail: eskulData.imagesThumbnail,
    slug: eskulData.slug,
    order: eskulData.order,
    isActive: eskulData.isActive,
    createdAt: eskulData.createdAt.toISOString(),
    updatedAt: eskulData.updatedAt.toISOString(),
    galleries: eskulData.galleries.map((g) => ({
      id: g.id,
      ekstrakulikerId: g.ekstrakulikulerId,
      imagePath: g.imagePath,
      caption: g.caption,
      order: g.order,
      createdAt: g.createdAt.toISOString(),
    })),
  };

  return (
    <MainLayout pageTitle={eskul.namaEskul} user={user}>
      <EkstrakulikulerDetail eskul={eskul} user={user} />
    </MainLayout>
  );
}
