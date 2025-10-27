"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { usePathname } from "next/navigation";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import { useState, useMemo } from "react";

interface SubMenuItem {
  label: string;
  href: string;
  permission?: string;
}

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  needAuth?: boolean;
  roleAccess?: string[];
  permission?: string;
  subItems?: SubMenuItem[];
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
  user: SessionUser | null | undefined;
}

const checkPermission = (
  userPermissions: string[] | undefined,
  requiredPermission: string | undefined
): boolean => {
  if (!requiredPermission) return true;
  if (!userPermissions) return false;

  return userPermissions.some((userPerm) => {
    if (userPerm === requiredPermission) return true;

    if (userPerm.includes("*")) {
      const regex = new RegExp("^" + userPerm.replace(/\*/g, ".*") + "$");
      return regex.test(requiredPermission);
    }

    if (requiredPermission.includes("*")) {
      const regex = new RegExp(
        "^" + requiredPermission.replace(/\*/g, ".*") + "$"
      );
      return regex.test(userPerm);
    }

    return false;
  });
};

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
    title: "PRESTASI",
    items: [
      {
        icon: "fas fa-trophy",
        label: "Siswa",
        href: "/prestasi/siswa",
      },
      {
        icon: "fas fa-award",
        label: "Sekolah",
        href: "/prestasi/sekolah",
      },
      {
        icon: "fas fa-star",
        label: "GTK",
        href: "/prestasi/gtk",

        subItems: [
          {
            label: "Provinsi",
            href: "/prestasi/gtk/provinsi",
          },
          {
            label: "Nasional",
            href: "/prestasi/gtk/nasional",
          },
          {
            label: "Internasional",
            href: "/prestasi/gtk/internasional",
          },
        ],
      },
    ],
  },
  {
    title: "PROGRAM SEKOLAH",
    items: [
      {
        icon: "fas fa-book-open",
        label: "Kurikulum",
        href: "/program/kurikulum",
      },
      {
        icon: "fas fa-user-tie",
        label: "Sarpras",
        href: "/program/sarpras",
      },
      {
        icon: "fas fa-users-line",
        label: "Siswa",
        href: "/program/siswa",
      },
      {
        icon: "fas fa-user-secret",
        label: "Humas",
        href: "/program/humas",
      },
      {
        icon: "fas fa-tags",
        label: "Jurusan",
        href: "/program/jurusan",

        subItems: [
          {
            label: "PPLG",
            href: "/program/jurusan/PPLG",
          },
          {
            label: "AKL",
            href: "/program/jurusan/AKL",
          },
          {
            label: "TKJ",
            href: "/program/jurusan/TKJ",
          },
          {
            label: "DKV",
            href: "/program/jurusan/DKV",
          },
          {
            label: "PHT",
            href: "/program/jurusan/PHT",
          },
          {
            label: "MPLB",
            href: "/program/jurusan/MPLB",
          },
          {
            label: "PM",
            href: "/program/jurusan/PM",
          },
          {
            label: "UPW",
            href: "/program/jurusan/UPW",
          },
          {
            label: "KULINER",
            href: "/program/jurusan/KULINER",
          },
          {
            label: "BUSANA",
            href: "/program/jurusan/BUSANA",
          },
        ],
      },
    ],
  },
  {
    title: "SISWA",
    items: [
      {
        icon: "fas fa-list",
        label: "List Siswa",
        href: "/siswa",
      },
      {
        icon: "fas fa-user-plus",
        label: "Tambah Siswa",
        href: "/siswa/tambah",
        needAuth: true,
        permission: "siswa.create",
      },
    ],
  },
  {
    title: "GURU",
    items: [
      {
        icon: "fas fa-list",
        label: "List Guru",
        href: "/guru",
      },
      {
        icon: "fas fa-user-plus",
        label: "Tambah Guru",
        href: "/guru/tambah",
        needAuth: true,
        permission: "guru.create",
      },
    ],
  },
  {
    title: "MATA PELAJARAN",
    items: [
      {
        icon: "fas fa-book",
        label: "List Mapel",
        href: "/mapel",
      },
      {
        icon: "fas fa-plus-circle",
        label: "Tambah Mapel",
        href: "/mapel/tambah",
        needAuth: true,
        permission: "mapel.create",
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        icon: "fas fa-users-gear",
        label: "Users",
        href: "/users",
        needAuth: true,
        permission: "users.view",
      },
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
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSubItemActive = (subItems: SubMenuItem[]) => {
    return subItems.some((subItem) => pathname === subItem.href);
  };

  const filteredMenuSections = useMemo(() => {
    return menuSections
      .map((section) => {
        if (section.needAuth && !user) return null;

        const visibleItems = section.items.filter((item) => {
          if (item.needAuth && !user) return false;

          if (item.permission && !user) return false;

          if (item.roleAccess && user) {
            if (!item.roleAccess.includes(user.role)) return false;
          }

          if (
            item.permission &&
            !checkPermission(user?.permissions, item.permission)
          ) {
            return false;
          }

          if (item.subItems) {
            const visibleSubItems = item.subItems.filter((subItem) => {
              if (subItem.permission && !user) return false;
              return checkPermission(user?.permissions, subItem.permission);
            });
            return visibleSubItems.length > 0;
          }

          return true;
        });

        if (visibleItems.length === 0) return null;

        return {
          ...section,
          items: visibleItems.map((item) => {
            if (item.subItems) {
              return {
                ...item,
                subItems: item.subItems.filter((subItem) => {
                  if (subItem.permission && !user) return false;
                  return checkPermission(user?.permissions, subItem.permission);
                }),
              };
            }
            return item;
          }),
        };
      })
      .filter(Boolean) as MenuSection[];
  }, [user]);

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
          {filteredMenuSections.map((section, index) => (
            <div key={index}>
              <div className={styles.menuSectionTitle}>{section.title}</div>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.subItems && item.subItems.length > 0 ? (
                    <>
                      <div
                        className={`${styles.menuItem} ${
                          isSubItemActive(item.subItems) ? styles.active : ""
                        }`}
                        onClick={() => toggleSubMenu(item.label)}
                      >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                        <i
                          className={`fas fa-chevron-down ${
                            styles.chevronIcon
                          } ${openSubMenus[item.label] ? styles.rotated : ""}`}
                        ></i>
                      </div>
                      <div
                        className={`${styles.subMenu} ${
                          openSubMenus[item.label] ? styles.open : ""
                        }`}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={`${styles.subMenuItem} ${
                              pathname === subItem.href
                                ? styles.activeSubItem
                                : ""
                            }`}
                          >
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${styles.menuItem} ${
                        pathname === item.href ? styles.active : ""
                      }`}
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isMobileOpen && <div className={styles.overlay} onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;
