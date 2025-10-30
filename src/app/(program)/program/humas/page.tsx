import MainLayout from "WT/components/Layout/Main";
import ProgramHumasMain from "WT/components/Views/program/ProgramHumasMain";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Program Humas - SMK N 4 Bandar Lampung",
  description: "Program Hubungan Masyarakat sistem manajemen sekolah",
};

export default async function ProgramHumasPage() {
  const user = await getCurrentUser();

  return (
    <MainLayout pageTitle="Program Humas" user={user}>
      <ProgramHumasMain user={user} />
    </MainLayout>
  );
}
