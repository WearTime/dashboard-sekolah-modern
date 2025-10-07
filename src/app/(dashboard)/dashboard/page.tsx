import MainLayout from "WT/components/Layout/Main";
import DashboardContent from "WT/components/Views/dashboard/DashboardContent";
import { getCurrentUser } from "WT/lib/auth";

export const metadata = {
  title: "Dashboard - SMK N 4 Bandar Lampung",
  description: "Dashboard sistem manajemen sekolah",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <MainLayout pageTitle="Dashboard" user={user}>
        <DashboardContent />
      </MainLayout>
    </>
  );
}
