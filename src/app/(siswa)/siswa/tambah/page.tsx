import { redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahSiswa from "WT/components/Views/student/StudentAdd";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Tambah Siswa - SMK N 4 Bandar Lampung",
  description: "Tambah Siswa sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <MainLayout pageTitle="Tambah Siswa" user={user}>
        <TambahSiswa />
      </MainLayout>
    </>
  );
}
