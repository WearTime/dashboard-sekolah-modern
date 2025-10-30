/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ekstrakulikuler` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ekstrakulikuler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ekstrakulikuler` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `program_jurusan` DROP FOREIGN KEY `program_jurusan_kode_jurusan_fkey`;

-- DropIndex
DROP INDEX `program_jurusan_kode_jurusan_program_id_key` ON `program_jurusan`;

-- AlterTable
ALTER TABLE `ekstrakulikuler` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `ekstrakulikuler_gallery` (
    `id` VARCHAR(191) NOT NULL,
    `ekstrakulikulerId` VARCHAR(191) NOT NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ekstrakulikuler_gallery_ekstrakulikulerId_idx`(`ekstrakulikulerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ekstrakulikuler_slug_key` ON `ekstrakulikuler`(`slug`);

-- AddForeignKey
ALTER TABLE `ekstrakulikuler_gallery` ADD CONSTRAINT `ekstrakulikuler_gallery_ekstrakulikulerId_fkey` FOREIGN KEY (`ekstrakulikulerId`) REFERENCES `ekstrakulikuler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

