"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { usePathname } from "next/navigation";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  needAuth?: boolean;
  roleAccess?: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  needAuth?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  user: SessionUser | undefined;
}

const menuSections: MenuSection[] = [
  {
    title: "GENERAL",
    items: [
      { icon: "fas fa-th-large", label: "Dashboard", href: "/dashboard" },
      {
        icon: "fas fa-sitemap",
        label: "Struktur Organisasi",
        href: "/struktur-organisasi",
      },
      {
        icon: "fas fa-users",
        label: "Ekstrakulikuler",
        href: "/ekstrakulikuler",
      },
    ],
  },
  {
    title: "SISWA",
    items: [
      { icon: "fas fa-list", label: "List Siswa", href: "/siswa" },
      {
        icon: "fas fa-user-plus",
        label: "Tambah Siswa",
        href: "/siswa/tambah",
        needAuth: true,
        roleAccess: ["ADMIN", "PRINCIPAL"],
      },
    ],
  },
  {
    title: "GURU",
    items: [
      { icon: "fas fa-list", label: "List Guru", href: "/guru" },
      {
        icon: "fas fa-user-plus",
        label: "Tambah Guru",
        href: "/guru/tambah",
        needAuth: true,
        roleAccess: ["ADMIN", "PRINCIPAL"],
      },
    ],
  },
  {
    title: "MATA PELAJARAN",
    items: [
      { icon: "fas fa-book", label: "List Mapel", href: "/mapel" },
      {
        icon: "fas fa-plus-circle",
        label: "Tambah Mapel",
        href: "/mapel/tambah",
        needAuth: true,
        roleAccess: ["ADMIN", "PRINCIPAL"],
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "fas fa-right-from-bracket", label: "Logout", href: "/logout" },
    ],
    needAuth: true,
  },
];

const Sidebar = ({
  isCollapsed,
  isMobileOpen,
  onToggle,
  onClose,
  user,
}: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${
          isMobileOpen ? styles.active : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <Image
              src="/logo.png"
              alt="SMK N 4 Logo"
              width={204}
              height={44}
              priority
            />
          </div>
          <Button className={styles.toggleBtn} onClick={onToggle}>
            <i className="fas fa-bars"></i>
          </Button>
          <Button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </Button>
        </div>

        <div className={styles.sidebarMenu}>
          {menuSections.map((section, index) => {
            if (section.needAuth && !user) return null;

            const visibleItems = section.items.filter((item) => {
              if (item.needAuth && !user) return false;

              if (item.roleAccess && user)
                return item.roleAccess.includes(user.role);

              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={index}>
                <div className={styles.menuSectionTitle}>{section.title}</div>
                {visibleItems.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`${styles.menuItem} ${
                      pathname === item.href ? styles.active : ""
                    }`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {isMobileOpen && <div className={styles.overlay} onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;
