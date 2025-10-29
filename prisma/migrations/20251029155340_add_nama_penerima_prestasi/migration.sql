/*
  Warnings:

  - Added the required column `nama_penerima` to the `Prestasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prestasi` ADD COLUMN `nama_penerima` VARCHAR(191) NOT NULL;
