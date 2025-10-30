import MainLayout from "WT/components/Layout/Main";
import ProgramKurikulumMain from "WT/components/Views/program/ProgramKurikulumMain";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Program Kurikulum - SMK N 4 Bandar Lampung",
  description: "Program Kurikulum sistem manajemen sekolah",
};

export default async function ProgramKurikulumPage() {
  const user = await getCurrentUser();

  return (
    <MainLayout pageTitle="Program Kurikulum" user={user}>
      <ProgramKurikulumMain user={user} />
    </MainLayout>
  );
}
