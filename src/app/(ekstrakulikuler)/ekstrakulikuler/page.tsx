import MainLayout from "WT/components/Layout/Main";
import EkstrakulikulerMain from "WT/components/Views/ekstrakulikuler/EkstrakulikulerMain";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Ekstrakulikuler - SMK N 4 Bandar Lampung",
  description: "Ekstrakulikuler sistem manajemen sekolah",
};

export default async function EkstrakulikulerPage() {
  const user = await getCurrentUser();

  return (
    <>
      <MainLayout pageTitle="Ekstrakulikuler" user={user}>
        <EkstrakulikulerMain user={user} />
      </MainLayout>
    </>
  );
}