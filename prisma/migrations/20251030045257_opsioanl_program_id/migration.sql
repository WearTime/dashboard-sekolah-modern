-- AlterTable
ALTER TABLE `program_jurusan` MODIFY `program_id` VARCHAR(191) NULL;

-- AlterTable (jika ada constraint yang perlu di-drop)
ALTER TABLE `program_jurusan` DROP FOREIGN KEY IF EXISTS `program_jurusan_program_id_fkey`;

-- Re-add foreign key dengan optional
ALTER TABLE `program_jurusan` ADD CONSTRAINT `program_jurusan_program_id_fkey` 
FOREIGN KEY (`program_id`) REFERENCES `program_sekolah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;