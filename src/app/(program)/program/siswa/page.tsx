import MainLayout from "WT/components/Layout/Main";
import ProgramSiswaMain from "WT/components/Views/program/ProgramSiswaMain";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Program Siswa - SMK N 4 Bandar Lampung",
  description: "Program Kesiswaan sistem manajemen sekolah",
};

export default async function ProgramSiswaPage() {
  const user = await getCurrentUser();

  return (
    <MainLayout pageTitle="Program Siswa" user={user}>
      <ProgramSiswaMain user={user} />
    </MainLayout>
  );
}
