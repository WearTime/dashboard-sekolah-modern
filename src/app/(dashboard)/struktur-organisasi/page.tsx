import MainLayout from "WT/components/Layout/Main";
import StrukturOrganisasi from "WT/components/Views/dashboard/StrukturOrganisasi";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Struktur Oraganisasi - SMK N 4 Bandar Lampung",
  description: "Struktur Oraganisasi sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <MainLayout pageTitle="Dashboard" user={user}>
        <StrukturOrganisasi />
      </MainLayout>
    </>
  );
}
