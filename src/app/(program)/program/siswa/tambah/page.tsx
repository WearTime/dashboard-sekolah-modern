import { forbidden, redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahProgram from "WT/components/Views/program/ProgramAdd";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

export const metadata = {
  title: "Tambah Program Siswa - SMK N 4 Bandar Lampung",
};

export default async function TambahProgramSiswaPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPermis = await hasPermission(user.id, "program.siswa.create");
  if (!userPermis) {
    forbidden();
  }

  return (
    <MainLayout pageTitle="Tambah Program Siswa" user={user}>
      <TambahProgram tipeProgram="Siswa" />
    </MainLayout>
  );
}
