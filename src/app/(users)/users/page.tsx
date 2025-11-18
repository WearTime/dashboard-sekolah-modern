import MainLayout from "WT/components/Layout/Main";
import ListUserPage from "WT/components/Views/users/UsersList";
import { getCurrentUser } from "WT/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Users Management - SMK N 4 Bandar Lampung",
  description: "Kelola pengguna sistem manajemen sekolah",
};

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && user.role !== "PRINCIPAL") {
    redirect("/dashboard");
  }

  return (
    <MainLayout pageTitle="Users Management" user={user}>
      <ListUserPage user={user} />
    </MainLayout>
  );
}
