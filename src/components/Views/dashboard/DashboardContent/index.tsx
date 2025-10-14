"use client";

import DashboardCharts from "../DashboardCharts";
import styles from "./dashboard.module.css";
import DrillDownNav from "WT/components/Layout/DrillDownNav";

const DashboardContent = () => {
  return (
    <>
      <DashboardCharts />
      <div className={styles.visionMissionCard}>
        <div className={styles.vmRow}>
          <div className={styles.vmSection}>
            <h5>Visi</h5>
            <p>
              Menghasilkan lulusan yang unggul, mampu bersaing dipasar global
              dan berkarakter Pancasila.
            </p>
          </div>
          <div className={styles.vmSection}>
            <h5>Misi</h5>
            <ul>
              <li>
                Menyelenggarakan kegiatan pembelajaran yang berpusat pada
                peserta didik yang berkarakter Pancasila dengan menerapkan
                Teaching Factory dan berbasis industry melalui pendekatan
                teknologi informatika dan komunikasi serta mencetak jiwa
                wirausaha/entrepreneurship.
              </li>
              <li>
                Menjalin dan mengembangkan kerjasama kemitraan dengan dunia
                kerja dalam mengembangkan kurikulum untuk menghasilkan lulusan
                yang unggul sesuai standar industri nasional dan internasional.
              </li>
              <li>
                Menggunakan sarana dan peralatan praktik yang sesuai dengan
                Standar Industri.
              </li>
              <li>
                Menerapkan pendidikan anti perundungan, ramah lingkungan,
                menyenangkan, harmonis dan dinamis
              </li>
            </ul>
          </div>
        </div>
      </div>

      <DrillDownNav />
    </>
  );
};

export default DashboardContent;
