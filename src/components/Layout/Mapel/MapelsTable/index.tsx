"use client";

import { Mapel } from "WT/types/mapel";
import styles from "./MapelsTable.module.css";
import { SessionUser } from "WT/types";
import Button from "WT/components/Ui/Button";
import ProtectedActionButtons from "WT/components/Ui/ProtectedActionButtons";

interface MapelTableProps {
  mapel: Mapel[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (kode_mapel: string, nama_mapel: string) => void;
  onView: (mapel: Mapel) => void;
  onEdit: (mapel: Mapel) => void;
  user: SessionUser | null | undefined;
}

const MapelTable = ({
  mapel,
  loading,
  currentPage,
  itemsPerPage,
  onDelete,
  onView,
  onEdit,
  user,
}: MapelTableProps) => {
  const getTipeMapelBadge = (tipe: string) => {
    const baseClass = styles.tipeBadge;
    switch (tipe) {
      case "Umum":
        return `${baseClass} ${styles.tipeUmum}`;
      case "Jurusan":
        return `${baseClass} ${styles.tipeJurusan}`;
      default:
        return baseClass;
    }
  };

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Mapel</th>
              <th>Nama Mata Pelajaran</th>
              <th>Fase</th>
              <th>Tipe</th>
              <th>Jurusan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <div className={styles.loadingState}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Memuat data...</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (mapel.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Mapel</th>
              <th>Nama Mata Pelajaran</th>
              <th>Fase</th>
              <th>Tipe</th>
              <th>Jurusan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox"></i>
                  <p>Tidak ada data mata pelajaran</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Mapel</th>
            <th>Nama Mata Pelajaran</th>
            <th>Fase</th>
            <th>Tipe</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mapel.map((item, idx) => (
            <tr key={item.kode_mapel} onClick={() => onView(item)}>
              <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
              <td>{item.kode_mapel}</td>
              <td>
                <div className={styles.mapelDetails}>
                  <h6>{item.nama_mapel}</h6>
                </div>
              </td>
              <td>{item.fase}</td>
              <td>
                <span className={getTipeMapelBadge(item.tipe_mapel)}>
                  {item.tipe_mapel}
                </span>
              </td>
              <td>{item.jurusan || "Semua"}</td>
              <td>
                <ProtectedActionButtons
                  user={user}
                  actions={[
                    {
                      icon: "fas fa-eye",
                      title: "Lihat Detail",
                      onClick: (e) => {
                        e.stopPropagation();
                        onView(item);
                      },
                      permission: "",
                      variant: "view",
                      needPermission: false,
                    },
                    {
                      icon: "fas fa-edit",
                      title: "Edit",
                      onClick: (e) => {
                        e.stopPropagation();
                        onEdit(item);
                      },
                      permission: "guru.edit",
                      variant: "edit",
                    },
                    {
                      icon: "fas fa-trash",
                      title: "Hapus",
                      onClick: (e) => {
                        e.stopPropagation();
                        onDelete(item.kode_mapel, item.nama_mapel);
                      },
                      permission: "guru.delete",
                      variant: "delete",
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapelTable;
