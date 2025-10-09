import MainLayout from "WT/components/Layout/Main";
import ListMapelPage from "WT/components/Views/mapel/MapelsList";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "List Mapel - SMK N 4 Bandar Lampung",
  description: "List Mapel sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <MainLayout pageTitle="List Mapel" user={user}>
        <ListMapelPage user={user} />
      </MainLayout>
    </>
  );
}
