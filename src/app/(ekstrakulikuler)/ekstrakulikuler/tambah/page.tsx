import { forbidden, redirect } from "next/navigation";
import MainLayout from "WT/components/Layout/Main";
import TambahEkstrakulikuler from "WT/components/Views/ekstrakulikuler/EkstrakulikulerAdd";
import { getCurrentUser } from "WT/lib/auth";
import { hasPermission } from "WT/lib/permissions";

export const metadata = {
  title: "Tambah Ekstrakulikuler - SMK N 4 Bandar Lampung",
  description: "Tambah Ekstrakulikuler sistem manajemen sekolah",
};

export default async function TambahEkstrakulikulerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPermis = await hasPermission(user.id, "ekstrakulikuler.create");
  if (!userPermis) {
    forbidden();
  }

  return (
    <>
      <MainLayout pageTitle="Tambah Ekstrakulikuler" user={user}>
        <TambahEkstrakulikuler />
      </MainLayout>
    </>
  );
}