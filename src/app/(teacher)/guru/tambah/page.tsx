import { redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahGuru from "WT/components/Views/teacher/TeacherAdd";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Tambah Guru - SMK N 4 Bandar Lampung",
  description: "Tambah Guru sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <MainLayout pageTitle="Tambah Guru" user={user}>
        <TambahGuru />
      </MainLayout>
    </>
  );
}
