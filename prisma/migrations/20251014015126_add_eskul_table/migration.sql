-- CreateTable
CREATE TABLE `ekstrakulikuler` (
    `id` VARCHAR(191) NOT NULL,
    `namaEskul` VARCHAR(191) NOT NULL,
    `pendamping` VARCHAR(191) NOT NULL,
    `ketua` VARCHAR(191) NOT NULL,
    `imagesThumbnail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
