-- AddForeignKey
ALTER TABLE `program_jurusan` ADD CONSTRAINT `program_jurusan_kode_jurusan_fkey` FOREIGN KEY (`kode_jurusan`) REFERENCES `jurusan`(`kode`) ON DELETE CASCADE ON UPDATE CASCADE;
