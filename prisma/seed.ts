import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@smkn4bdl.sch.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@smkn4bdl.sch.id",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@smkn4bdl.sch.id" },
    update: {},
    create: {
      name: "Guru Example",
      email: "teacher@smkn4bdl.sch.id",
      password: hashedPassword,
      role: "TEACHER",
    },
  });

  console.log("✅ Teacher user created:", teacher);

  const principal = await prisma.user.upsert({
    where: { email: "principal@smkn4bdl.sch.id" },
    update: {},
    create: {
      name: "Kepala Sekolah",
      email: "principal@smkn4bdl.sch.id",
      password: hashedPassword,
      role: "PRINCIPAL",
    },
  });

  console.log("✅ Principal user created:", principal);

  const siswa = await prisma.dataSiswa.upsert({
    where: { nisn: "01111111111" },
    update: {},
    create: {
      nisn: "01111111111",
      nama: "Muhamad Rizqi Wiransyah",
      kelas: "XII",
      jurusan: "PPLG",
      no_hp: "09999999",
      jenis_kelamin: "L",
      tempat_lahir: "Jepang",
      tanggal_lahir: new Date("2008-10-04"),
      alamat: "Aku Aku Jepang",
      image: null,
    },
  });

  console.log("✅ Siswa #1 created:", siswa);

  const siswa2 = await prisma.dataSiswa.upsert({
    where: { nisn: "0222222222" },
    update: {},
    create: {
      nisn: "0222222222",
      nama: "Muhammad Bangkit Sanjaya",
      kelas: "XII",
      jurusan: "PPLG",
      no_hp: "09999999",
      jenis_kelamin: "L",
      tempat_lahir: "Jepang",
      tanggal_lahir: new Date("2008-10-16"),
      alamat: "Aku Aku Jepang",
      image: null,
    },
  });

  console.log("✅ Siswa #2 created:", siswa2);

  const siswa3 = await prisma.dataSiswa.upsert({
    where: { nisn: "0333333333" },
    update: {},
    create: {
      nisn: "0333333333",
      nama: "Dwi Agustin",
      kelas: "XII",
      jurusan: "PPLG",
      no_hp: "08123456789",
      jenis_kelamin: "P",
      tempat_lahir: "Bandung",
      tanggal_lahir: new Date("2009-05-20"),
      alamat: "Jl. Merdeka No. 10",
      image: null,
    },
  });
  console.log("✅ Siswa #3 created:", siswa3);

  const siswa4 = await prisma.dataSiswa.upsert({
    where: { nisn: "0333333333" },
    update: {},
    create: {
      nisn: "0333333333",
      nama: "Syafa Aulia",
      kelas: "XI",
      jurusan: "AKL",
      no_hp: "08123456789",
      jenis_kelamin: "P",
      tempat_lahir: "Padang",
      tanggal_lahir: new Date("2008-12-13"),
      alamat: "Jl. Merdeka No. 10",
      image: null,
    },
  });
  console.log("✅ Siswa #4 created:", siswa3);

  const guru1 = await prisma.dataGuru.upsert({
    where: { nip: "198501012010011001" },
    update: {},
    create: {
      nip: "198501012010011001",
      nama: "Dr. Ahmad Fauzi, S.Pd., M.Kom",
      no_hp: "081234567890",
      alamat: "Jl. Pendidikan No. 45, Bandar Lampung",
      jenis_kelamin: "L",
      status: "ASN",
      golongan: "IV/a",
      image: null,
    },
  });
  console.log("✅ Guru #1 created:", guru1);

  const guru2 = await prisma.dataGuru.upsert({
    where: { nip: "199203152015032002" },
    update: {},
    create: {
      nip: "199203152015032002",
      nama: "Siti Aminah, S.Kom., M.T",
      no_hp: "082345678901",
      alamat: "Jl. Teknologi No. 12, Bandar Lampung",
      jenis_kelamin: "P",
      status: "P3K",
      golongan: "Jenjang 1",
      image: null,
    },
  });
  console.log("✅ Guru #2 created:", guru2);

  const guru3 = await prisma.dataGuru.upsert({
    where: { nip: "198812202012121003" },
    update: {},
    create: {
      nip: "198812202012121003",
      nama: "Budi Santoso, S.Pd",
      no_hp: "083456789012",
      alamat: "Jl. Guru No. 7, Bandar Lampung",
      jenis_kelamin: "L",
      status: "ASN",
      golongan: "III/d",
      image: null,
    },
  });
  console.log("✅ Guru #3 created:", guru3);

  const guru4 = await prisma.dataGuru.upsert({
    where: { nip: "199505102020012004" },
    update: {},
    create: {
      nip: "199505102020012004",
      nama: "Rina Wijaya, S.Kom",
      no_hp: "084567890123",
      alamat: "Jl. Informatika No. 22, Bandar Lampung",
      jenis_kelamin: "P",
      status: "Honorer",
      golongan: null,
      image: null,
    },
  });
  console.log("✅ Guru #4 created:", guru4);

  const guru5 = await prisma.dataGuru.upsert({
    where: { nip: "198706252011011005" },
    update: {},
    create: {
      nip: "198706252011011005",
      nama: "Dedi Hermawan, S.Pd., M.Pd",
      no_hp: "085678901234",
      alamat: "Jl. Pahlawan No. 33, Bandar Lampung",
      jenis_kelamin: "L",
      status: "ASN",
      golongan: "IV/b",
      image: null,
    },
  });
  console.log("✅ Guru #5 created:", guru5);

  const mapel1 = await prisma.mapel.upsert({
    where: { kode_mapel: "PPLG-001" },
    update: {},
    create: {
      kode_mapel: "PPLG-001",
      nama_mapel: "Pemrograman Berorientasi Objek",
      fase: "F",
      tipe_mapel: "Jurusan",
      jurusan: "PPLG",
    },
  });
  console.log("✅ Mapel #1 created:", mapel1);

  const mapel2 = await prisma.mapel.upsert({
    where: { kode_mapel: "PPLG-002" },
    update: {},
    create: {
      kode_mapel: "PPLG-002",
      nama_mapel: "Basis Data",
      fase: "F",
      tipe_mapel: "Jurusan",
      jurusan: "PPLG",
    },
  });
  console.log("✅ Mapel #2 created:", mapel2);

  const mapel3 = await prisma.mapel.upsert({
    where: { kode_mapel: "PPLG-003" },
    update: {},
    create: {
      kode_mapel: "PPLG-003",
      nama_mapel: "Pemrograman Web dan Perangkat Bergerak",
      fase: "F",
      tipe_mapel: "Jurusan",
      jurusan: "PPLG",
    },
  });
  console.log("✅ Mapel #3 created:", mapel3);

  const mapel4 = await prisma.mapel.upsert({
    where: { kode_mapel: "UMM-001" },
    update: {},
    create: {
      kode_mapel: "UMM-001",
      nama_mapel: "Matematika",
      fase: "F",
      tipe_mapel: "Umum",
      jurusan: "Semua",
    },
  });
  console.log("✅ Mapel #4 created:", mapel4);

  const mapel5 = await prisma.mapel.upsert({
    where: { kode_mapel: "UMM-002" },
    update: {},
    create: {
      kode_mapel: "UMM-002",
      nama_mapel: "Bahasa Indonesia",
      fase: "F",
      tipe_mapel: "Umum",
      jurusan: "Semua",
    },
  });
  console.log("✅ Mapel #5 created:", mapel5);

  const mapel6 = await prisma.mapel.upsert({
    where: { kode_mapel: "PPLG-004" },
    update: {},
    create: {
      kode_mapel: "PPLG-004",
      nama_mapel: "Produk Kreatif dan Kewirausahaan",
      fase: "F",
      tipe_mapel: "Jurusan",
      jurusan: "PPLG",
    },
  });
  console.log("✅ Mapel #6 created:", mapel6);

  const guruMapel1 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "PPLG-001",
        nip_guru: "198501012010011001",
      },
    },
    update: {},
    create: {
      kode_mapel: "PPLG-001",
      nip_guru: "198501012010011001",
    },
  });
  console.log("✅ GuruAndMapel #1 created:", guruMapel1);

  const guruMapel2 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "PPLG-002",
        nip_guru: "198501012010011001",
      },
    },
    update: {},
    create: {
      kode_mapel: "PPLG-002",
      nip_guru: "198501012010011001",
    },
  });
  console.log("✅ GuruAndMapel #2 created:", guruMapel2);

  const guruMapel3 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "PPLG-003",
        nip_guru: "198501012010011001",
      },
    },
    update: {},
    create: {
      kode_mapel: "PPLG-003",
      nip_guru: "198501012010011001",
    },
  });
  console.log("✅ GuruAndMapel #3 created:", guruMapel3);

  const guruMapel4 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "PPLG-002",
        nip_guru: "199203152015032002",
      },
    },
    update: {},
    create: {
      kode_mapel: "PPLG-002",
      nip_guru: "199203152015032002",
    },
  });
  console.log("✅ GuruAndMapel #4 created:", guruMapel4);

  const guruMapel5 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "PPLG-003",
        nip_guru: "199203152015032002",
      },
    },
    update: {},
    create: {
      kode_mapel: "PPLG-003",
      nip_guru: "199203152015032002",
    },
  });
  console.log("✅ GuruAndMapel #5 created:", guruMapel5);

  const guruMapel6 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "UMM-001",
        nip_guru: "198812202012121003",
      },
    },
    update: {},
    create: {
      kode_mapel: "UMM-001",
      nip_guru: "198812202012121003",
    },
  });
  console.log("✅ GuruAndMapel #6 created:", guruMapel6);

  const guruMapel7 = await prisma.guruAndMapel.upsert({
    where: {
      kode_mapel_nip_guru: {
        kode_mapel: "PPLG-004",
        nip_guru: "199505102020012004",
      },
    },
    update: {},
    create: {
      kode_mapel: "PPLG-004",
      nip_guru: "199505102020012004",
    },
  });
  console.log("✅ GuruAndMapel #7 created:", guruMapel7);

  console.log("🎉 Seed completed!");
  console.log("\n📊 Summary:");
  console.log("- Users: 3 (Admin, Teacher, Principal)");
  console.log("- Siswa: 4");
  console.log("- Guru: 5 (4 with mapel, 1 without mapel)");
  console.log("- Mapel: 6 (3 PPLG jurusan, 2 Umum, 1 PKK)");
  console.log("- GuruAndMapel Relations: 7");
  console.log("\n📝 Test Scenarios:");
  console.log("✓ Guru dengan multiple mapel (Ahmad: 3 mapel)");
  console.log(
    "✓ Mapel dengan multiple guru (Basis Data: 2 guru, Web & Mobile: 2 guru)"
  );
  console.log("✓ Guru tanpa mapel (Dedi - demonstrating optional)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
