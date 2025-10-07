"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    };
    logout();
  }, [router]);

  return <p>Logging out...</p>;
};

export default LogoutPage;
