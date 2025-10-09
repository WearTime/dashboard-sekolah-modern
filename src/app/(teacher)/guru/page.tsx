import MainLayout from "WT/components/Layout/Main";
import ListGuruPage from "WT/components/Views/teacher/TeachersList";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "List Teacher - SMK N 4 Bandar Lampung",
  description: "List Teacher sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <MainLayout pageTitle="List Teacher" user={user}>
        <ListGuruPage user={user} />
      </MainLayout>
    </>
  );
}
