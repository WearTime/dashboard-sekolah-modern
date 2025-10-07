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

  console.log("✅ Siswa #1 created:", siswa2);

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
