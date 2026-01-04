import { forbidden, redirect, notFound } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahProgram from "WT/components/Views/program/ProgramAdd";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";
import {
  getProgramConfigByPath,
  PROGRAM_CONFIGS,
} from "WT/config/program.config";

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const config = getProgramConfigByPath(resolvedParams.type);

  if (!config) {
    return { title: "Halaman tidak ditemukan" };
  }

  return {
    title: `Tambah ${config.titleFull} - SMK N 4 Bandar Lampung`,
    description: `Tambah ${config.titleFull} sistem manajemen sekolah`,
  };
}

export default async function TambahProgramPage({ params }: PageProps) {
  const resolvedParams = await params;
  const config = getProgramConfigByPath(resolvedParams.type);

  if (!config) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPermis = await hasPermission(
    user.id,
    `${config.permissionPrefix}.create`
  );

  if (!userPermis) {
    forbidden();
  }

  return (
    <MainLayout pageTitle={`Tambah ${config.titleFull}`} user={user}>
      <TambahProgram tipeProgram={config.tipe} />
    </MainLayout>
  );
}

export async function generateStaticParams() {
  return Object.values(PROGRAM_CONFIGS).map((config) => ({
    type: config.path,
  }));
}
