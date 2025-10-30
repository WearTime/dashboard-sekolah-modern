import { notFound } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import ProgramJurusanMain from "WT/components/Views/program/ProgramJurusanMain";
import { getCurrentUser } from "WT/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ kode: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const kode = resolvedParams.kode.toUpperCase();

  const jurusan = await prisma.jurusan.findUnique({
    where: { kode },
  });

  if (!jurusan) {
    return { title: "Halaman tidak ditemukan" };
  }

  return {
    title: `Program ${jurusan.nama} - SMK N 4 Bandar Lampung`,
    description: `Program Jurusan ${jurusan.nama_lengkap} sistem manajemen sekolah`,
  };
}

export default async function ProgramJurusanPage({ params }: PageProps) {
  const resolvedParams = await params;
  const kode = resolvedParams.kode.toUpperCase();
  const user = await getCurrentUser();

  const jurusan = await prisma.jurusan.findUnique({
    where: { kode },
  });

  if (!jurusan) {
    notFound();
  }

  return (
    <MainLayout pageTitle={`Program ${jurusan.nama}`} user={user}>
      <ProgramJurusanMain user={user} jurusan={jurusan} />
    </MainLayout>
  );
}

export async function generateStaticParams() {
  const jurusans = await prisma.jurusan.findMany({
    select: { kode: true },
  });

  return jurusans.map((jurusan) => ({
    kode: jurusan.kode.toLowerCase(),
  }));
}
