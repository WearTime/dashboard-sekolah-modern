import MainLayout from "WT/components/Layout/Main";
import ListSiswaPage from "WT/components/Views/student/StudentsList";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "List SIswa - SMK N 4 Bandar Lampung",
  description: "List Siswa sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <MainLayout pageTitle="List Siswa" user={user}>
        <ListSiswaPage user={user} />
      </MainLayout>
    </>
  );
}
