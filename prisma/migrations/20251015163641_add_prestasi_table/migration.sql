-- CreateTable
CREATE TABLE `Prestasi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `penyelenggara` VARCHAR(191) NOT NULL,
    `recipient_type` ENUM('Siswa', 'Sekolah', 'GTK') NOT NULL,
    `level` ENUM('Provinsi', 'Nasional', 'Internasional') NOT NULL,
    `tanggal` DATE NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
