-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TEACHER', 'PRINCIPAL') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_siswa` (
    `nisn` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kelas` ENUM('X', 'XI', 'XII') NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `tempat_lahir` VARCHAR(191) NULL,
    `tanggal_lahir` DATE NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`nisn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_guru` (
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL DEFAULT 'L',
    `image` VARCHAR(191) NULL,
    `status` ENUM('ASN', 'P3K', 'Honorer') NOT NULL DEFAULT 'Honorer',
    `golongan` VARCHAR(191) NULL,

    PRIMARY KEY (`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_stafftu` (
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL DEFAULT 'L',

    PRIMARY KEY (`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mapel` (
    `kode_mapel` VARCHAR(191) NOT NULL,
    `nama_mapel` VARCHAR(191) NOT NULL,
    `fase` VARCHAR(191) NOT NULL,
    `tipe_mapel` ENUM('Umum', 'Jurusan') NOT NULL DEFAULT 'Umum',
    `jurusan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kode_mapel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuruAndMapel` (
    `id` VARCHAR(191) NOT NULL,
    `kode_mapel` VARCHAR(191) NOT NULL,
    `nip_guru` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuruAndMapel_kode_mapel_nip_guru_key`(`kode_mapel`, `nip_guru`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `struktur_organisasi` (
    `nip` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `struktur_organisasi_nip_key`(`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuruAndMapel` ADD CONSTRAINT `GuruAndMapel_kode_mapel_fkey` FOREIGN KEY (`kode_mapel`) REFERENCES `mapel`(`kode_mapel`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuruAndMapel` ADD CONSTRAINT `GuruAndMapel_nip_guru_fkey` FOREIGN KEY (`nip_guru`) REFERENCES `data_guru`(`nip`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `struktur_organisasi` ADD CONSTRAINT `struktur_organisasi_nip_fkey` FOREIGN KEY (`nip`) REFERENCES `data_guru`(`nip`) ON DELETE CASCADE ON UPDATE CASCADE;
