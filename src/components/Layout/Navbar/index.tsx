"use client";

import { SessionUser } from "WT/types";
import styles from "./Navbar.module.css";
import { redirect } from "next/navigation";
import Button from "WT/components/Ui/Button";

interface NavbarProps {
  title: string;
  user: SessionUser | null | undefined;
}

const Navbar = ({ title = "Dashboard", user }: NavbarProps) => {
  return (
    <div className={styles.topBar}>
      <h4>{title}</h4>
      {!user ? (
        <div className={styles.userNotLogin}>
          <Button
            className={styles.buttonLogin}
            onClick={() => redirect("/login")}
          >
            Login
          </Button>
        </div>
      ) : (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.userDetails}>
            <h6>{user?.name}</h6>
            <p>{user?.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
