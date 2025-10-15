/*
  Warnings:

  - You are about to drop the `jurusan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `data_siswa` DROP FOREIGN KEY `data_siswa_jurusan_fkey`;

-- DropIndex
DROP INDEX `data_siswa_jurusan_fkey` ON `data_siswa`;

-- DropTable
DROP TABLE `jurusan`;
