import { notFound, forbidden, redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahProgramJurusan from "WT/components/Views/program/ProgramJurusanAdd";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";
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
    title: `Tambah Program ${jurusan.nama} - SMK N 4 Bandar Lampung`,
  };
}

export default async function TambahProgramJurusanPage({ params }: PageProps) {
  const resolvedParams = await params;
  const kode = resolvedParams.kode.toUpperCase();
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const jurusan = await prisma.jurusan.findUnique({
    where: { kode },
  });

  if (!jurusan) {
    notFound();
  }

  const userPermis = await hasPermission(
    user.id,
    `program.jurusan.${kode}.create`
  );
  if (!userPermis) {
    forbidden();
  }

  return (
    <MainLayout pageTitle={`Tambah Program ${jurusan.nama}`} user={user}>
      <TambahProgramJurusan jurusan={jurusan} />
    </MainLayout>
  );
}
