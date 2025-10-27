"use client";

import { useState, useEffect, ReactNode } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import styles from "./Main.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  user?: SessionUser | null;
}

const MainLayout = ({
  children,
  pageTitle = "Dashboard",
  user,
}: MainLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleClose = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggle={handleToggle}
        onClose={handleClose}
        user={user}
      />

      <div
        className={`${styles.mainContent} ${
          isCollapsed ? styles.expanded : ""
        }`}
      >
        <Navbar title={pageTitle} user={user} />

        <div className={styles.contentArea}>{children}</div>
      </div>

      {isCollapsed && !isMobile && (
        <Button className={styles.desktopToggle} onClick={handleToggle}>
          <i className="fas fa-bars"></i>
        </Button>
      )}

      {isMobile && (
        <Button className={styles.mobileToggle} onClick={handleToggle}>
          <i className="fas fa-bars"></i>
        </Button>
      )}
    </div>
  );
};
export default MainLayout;
