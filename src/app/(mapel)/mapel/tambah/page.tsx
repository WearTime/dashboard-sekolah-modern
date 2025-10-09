import { redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahMapel from "WT/components/Views/mapel/MapelAdd";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Tambah Mapel - SMK N 4 Bandar Lampung",
  description: "Tambah Mapel sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <MainLayout pageTitle="Tambah Mapel" user={user}>
        <TambahMapel />
      </MainLayout>
    </>
  );
}
