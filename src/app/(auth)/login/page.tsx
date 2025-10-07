import LoginForm from "WT/components/Views/auth/LoginForm";
import AuthLayout from "WT/components/Layout/Auth";

export const metadata = {
  title: "Login - SMK N 4 Bandar Lampung",
  description: "Login ke sistem manajemen sekolah",
};

const LoginPage = () => {
  return (
    <>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default LoginPage;
