-- CreateTable
CREATE TABLE `jurusan` (
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`kode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_sekolah` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NOT NULL,
    `tipe_program` ENUM('Kurikulum', 'Sarpras', 'Siswa', 'Humas') NOT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_jurusan` (
    `id` VARCHAR(191) NOT NULL,
    `kode_jurusan` VARCHAR(191) NOT NULL,
    `program_id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NOT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `program_jurusan_kode_jurusan_program_id_key`(`kode_jurusan`, `program_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kegiatan_program` (
    `id` VARCHAR(191) NOT NULL,
    `program_id` VARCHAR(191) NULL,
    `program_jurusan_id` VARCHAR(191) NULL,
    `nama_kegiatan` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NOT NULL,
    `tanggal` DATE NOT NULL,
    `lokasi` VARCHAR(191) NULL,
    `peserta` VARCHAR(191) NULL,
    `images` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `program_jurusan` ADD CONSTRAINT `program_jurusan_kode_jurusan_fkey` FOREIGN KEY (`kode_jurusan`) REFERENCES `jurusan`(`kode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_jurusan` ADD CONSTRAINT `program_jurusan_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `program_sekolah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kegiatan_program` ADD CONSTRAINT `kegiatan_program_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `program_sekolah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kegiatan_program` ADD CONSTRAINT `kegiatan_program_program_jurusan_id_fkey` FOREIGN KEY (`program_jurusan_id`) REFERENCES `program_jurusan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
