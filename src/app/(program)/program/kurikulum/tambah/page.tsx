import { forbidden, redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahProgram from "WT/components/Views/program/ProgramAdd";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

export const metadata = {
  title: "Tambah Program Kurikulum - SMK N 4 Bandar Lampung",
  description: "Tambah Program Kurikulum sistem manajemen sekolah",
};

export default async function TambahProgramKurikulumPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPermis = await hasPermission(user.id, "program.kurikulum.create");
  if (!userPermis) {
    forbidden();
  }

  return (
    <MainLayout pageTitle="Tambah Program Kurikulum" user={user}>
      <TambahProgram tipeProgram="Kurikulum" />
    </MainLayout>
  );
}
