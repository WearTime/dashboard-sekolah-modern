import { forbidden, redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahSiswa from "WT/components/Views/student/StudentAdd";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

export const metadata = {
  title: "Tambah Siswa - SMK N 4 Bandar Lampung",
  description: "Tambah Siswa sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  const userPermis = await hasPermission(user.id, "siswa.create");
  if (!userPermis) {
    forbidden();
  }
  return (
    <>
      <MainLayout pageTitle="Tambah Siswa" user={user}>
        <TambahSiswa />
      </MainLayout>
    </>
  );
}
