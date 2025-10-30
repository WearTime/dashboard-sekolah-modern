import MainLayout from "WT/components/Layout/Main";
import ProgramSarprasMain from "WT/components/Views/program/ProgramSarprasMain";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Program Sarpras - SMK N 4 Bandar Lampung",
  description: "Program Sarana dan Prasarana sistem manajemen sekolah",
};

export default async function ProgramSarprasPage() {
  const user = await getCurrentUser();

  return (
    <MainLayout pageTitle="Program Sarpras" user={user}>
      <ProgramSarprasMain user={user} />
    </MainLayout>
  );
}
