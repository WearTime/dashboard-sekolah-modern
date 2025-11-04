import {
  Permission,
  PermissionAction,
  Prisma,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const jurusanList = [
  "PPLG",
  "AKL",
  "TKJ",
  "DKV",
  "PHT",
  "MPLB",
  "PM",
  "UPW",
  "KULINER",
  "BUSANA",
];

type PermissionConfig = {
  resource: string;
  actions: PermissionAction[];
  prefix?: string;
  descriptions?: Partial<Record<PermissionAction, string>>;
};

const generatePermissions = (config: PermissionConfig) => {
  const { resource, actions, prefix, descriptions } = config;

  const defaultDescriptions: Record<PermissionAction, string> = {
    [PermissionAction.view]: `Lihat ${resource}`,
    [PermissionAction.create]: `Create ${resource}`,
    [PermissionAction.edit]: `Edit ${resource}`,
    [PermissionAction.delete]: `Delete ${resource}`,
    [PermissionAction.import]: `Import ${resource}`,
    [PermissionAction.export]: `Export ${resource}`,
  };

  return actions.map((action) => ({
    name: prefix ? `${prefix}.${action}` : `${resource}.${action}`,
    description: defaultDescriptions[action] || descriptions?.[action],
    resource,
    action,
  }));
};

const buildPermissionList = () => {
  const CRUD = [
    PermissionAction.view,
    PermissionAction.create,
    PermissionAction.edit,
    PermissionAction.delete,
  ];

  const VIEW_ONLY = [PermissionAction.view];
  const CUD = [
    PermissionAction.create,
    PermissionAction.edit,
    PermissionAction.delete,
    PermissionAction.export,
    PermissionAction.import,
  ];
  const ALL = [
    PermissionAction.view,
    PermissionAction.create,
    PermissionAction.edit,
    PermissionAction.delete,
    PermissionAction.import,
    PermissionAction.export,
  ];

  const permissions = [
    // ...generatePermissions({
    //   resource: "struktur_organisasi",
    //   actions: VIEW_ONLY,
    //   prefix: "struktur-organisasi",
    //   descriptions: {
    //     [PermissionAction.view]: "Lihat Struktur Organisasi",
    //   },
    // }),

    ...generatePermissions({
      resource: "ekstrakulikuler",
      actions: CUD,
      prefix: "ekstrakulikuler",
      descriptions: {
        [PermissionAction.view]: "Lihat Ekstrakulikuler",
        [PermissionAction.create]: "Create Ekstrakulikuler",
        [PermissionAction.edit]: "Edit Ekstrakulikuler",
        [PermissionAction.delete]: "Delete Ekstrakulikuler",
      },
    }),

    ...["provinsi", "nasional", "internasional"].flatMap((level) =>
      generatePermissions({
        resource: "prestasi_siswa",
        actions: CUD,
        prefix: `prestasi.siswa.${level}`,
        descriptions: {
          [PermissionAction.create]: `Create Prestasi Siswa ${level}`,
          [PermissionAction.edit]: `Edit Prestasi Siswa ${level}`,
          [PermissionAction.delete]: `Delete Prestasi Siswa ${level}`,
          [PermissionAction.export]: `Export Prestasi Siswa ${level}`,
          [PermissionAction.import]: `Import Prestasi Siswa ${level}`,
        },
      })
    ),

    ...generatePermissions({
      resource: "prestasi_siswa",
      actions: CUD,
      prefix: "prestasi.siswa",
      descriptions: {},
    }),

    ...["provinsi", "nasional", "internasional"].flatMap((level) =>
      generatePermissions({
        resource: "prestasi_sekolah",
        actions: CUD,
        prefix: `prestasi.sekolah.${level}`,
        descriptions: {
          [PermissionAction.create]: `Create Prestasi Sekolah ${level}`,
          [PermissionAction.edit]: `Edit Prestasi Sekolah ${level}`,
          [PermissionAction.delete]: `Delete Prestasi Sekolah ${level}`,
          [PermissionAction.export]: `Export Prestasi Sekolah ${level}`,
          [PermissionAction.import]: `Import Prestasi Sekolah ${level}`,
        },
      })
    ),

    ...generatePermissions({
      resource: "prestasi_sekolah",
      actions: CUD,
      prefix: "prestasi.sekolah",
      descriptions: {},
    }),

    ...["provinsi", "nasional", "internasional"].flatMap((level) =>
      generatePermissions({
        resource: "prestasi_gtk",
        actions: CUD,
        prefix: `prestasi.gtk.${level}`,
        descriptions: {
          [PermissionAction.view]: `Lihat Prestasi GTK ${level}`,
          [PermissionAction.create]: `Create Prestasi GTK ${level}`,
          [PermissionAction.edit]: `Edit Prestasi GTK ${level}`,
          [PermissionAction.delete]: `Delete Prestasi GTK ${level}`,
          [PermissionAction.export]: `Export Prestasi GTK ${level}`,
          [PermissionAction.import]: `Import Prestasi GTK ${level}`,
        },
      })
    ),

    ...generatePermissions({
      resource: "prestasi_gtk",
      actions: [PermissionAction.view],
      prefix: "prestasi.gtk",
      descriptions: {
        [PermissionAction.view]: "Lihat Semua Prestasi GTK",
      },
    }),

    ...generatePermissions({
      resource: "kurikulum",
      actions: CUD,
      prefix: "program.kurikulum",
      descriptions: {
        [PermissionAction.view]: "Lihat Kurikulum",
        [PermissionAction.create]: "Create Kurikulum",
        [PermissionAction.edit]: "Edit Kurikulum",
        [PermissionAction.delete]: "Delete Kurikulum",
      },
    }),

    ...generatePermissions({
      resource: "sarpras",
      actions: CUD,
      prefix: "program.sarpras",
      descriptions: {
        [PermissionAction.view]: "Lihat Sarpras",
        [PermissionAction.create]: "Create Sarpras",
        [PermissionAction.edit]: "Edit Sarpras",
        [PermissionAction.delete]: "Delete Sarpras",
      },
    }),

    ...generatePermissions({
      resource: "program_siswa",
      actions: CUD,
      prefix: "program.siswa",
      descriptions: {
        [PermissionAction.view]: "Lihat Program Siswa",
        [PermissionAction.create]: "Create Program Siswa",
        [PermissionAction.edit]: "Edit Program Siswa",
        [PermissionAction.delete]: "Delete Program Siswa",
      },
    }),

    ...generatePermissions({
      resource: "program_humas",
      actions: CUD,
      prefix: "program.humas",
      descriptions: {
        [PermissionAction.view]: "Lihat Humas",
        [PermissionAction.create]: "Create Humas",
        [PermissionAction.edit]: "Edit Humas",
        [PermissionAction.delete]: "Delete Humas",
      },
    }),

    ...generatePermissions({
      resource: "siswa",
      actions: CUD,
      prefix: "siswa",
      descriptions: {
        [PermissionAction.view]: "Lihat List Siswa",
        [PermissionAction.create]: "Tambah Siswa",
        [PermissionAction.edit]: "Edit Siswa",
        [PermissionAction.delete]: "Delete Siswa",
      },
    }),

    ...generatePermissions({
      resource: "guru",
      actions: CUD,
      prefix: "guru",
      descriptions: {
        [PermissionAction.view]: "Lihat List Guru",
        [PermissionAction.create]: "Tambah Guru",
        [PermissionAction.edit]: "Edit Guru",
        [PermissionAction.delete]: "Delete Guru",
      },
    }),

    ...generatePermissions({
      resource: "mapel",
      actions: CUD,
      prefix: "mapel",
      descriptions: {
        [PermissionAction.view]: "Lihat List Mapel",
        [PermissionAction.create]: "Tambah Mapel",
        [PermissionAction.edit]: "Edit Mapel",
        [PermissionAction.delete]: "Delete Mapel",
      },
    }),

    ...generatePermissions({
      resource: "user",
      actions: CRUD,
      prefix: "users",
      descriptions: {
        [PermissionAction.view]: "Lihat Users",
        [PermissionAction.create]: "Buat User",
        [PermissionAction.edit]: "Edit User",
        [PermissionAction.delete]: "Hapus User",
      },
    }),

    ...jurusanList.flatMap((jurusan) =>
      generatePermissions({
        resource: "jurusan",
        actions: CUD,
        prefix: `program.jurusan.${jurusan}`,
        descriptions: {
          [PermissionAction.view]: `View untuk jurusan ${jurusan}`,
          [PermissionAction.create]: `Create untuk jurusan ${jurusan}`,
          [PermissionAction.edit]: `Edit untuk jurusan ${jurusan}`,
          [PermissionAction.delete]: `Delete untuk jurusan ${jurusan}`,
        },
      })
    ),
  ];

  return permissions;
};

const expandPatterns = (patterns: string[], allNames: string[]): string[] => {
  const out = new Set<string>();

  for (const pat of patterns) {
    if (pat === "*") {
      allNames.forEach((n) => out.add(n));
      continue;
    }

    if (pat.includes("*")) {
      const regex = new RegExp("^" + pat.replace(/\*/g, ".*") + "$");
      allNames.forEach((n) => {
        if (regex.test(n)) out.add(n);
      });
    } else {
      if (allNames.includes(pat)) out.add(pat);
    }
  }

  return Array.from(out);
};

const userSeed = async () => {
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
};

const siswaSeed = async () => {
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
    where: { nisn: "0444444444" },
    update: {},
    create: {
      nisn: "0444444444",
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
  console.log("✅ Siswa #4 created:", siswa4);
};

const guruSeed = async () => {
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
};

const mapelSeed = async () => {
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
};

const guruAndMapelSeed = async () => {
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
};

const permissionsSeed = async () => {
  console.log("🔐 Running permissionSeed...");

  const permissionList = buildPermissionList();

  const createManyPayload = permissionList.map((p) => ({
    name: p.name,
    description: p.description,
    resource: p.resource,
    action: p.action,
  }));

  try {
    await prisma.permission.createMany({
      data: createManyPayload,
      skipDuplicates: true,
    });
    console.log(`✅ ${permissionList.length} permissions upserted.`);
  } catch (error) {
    console.error(
      "❌ createMany permission failed, falling back to upsert per-item:",
      error
    );
    for (const p of createManyPayload) {
      await prisma.permission.upsert({
        where: { name: p.name },
        update: {},
        create: p,
      });
    }
    console.log("✅ fallback upsert-permission complete.");
  }

  const allPermissions: Permission[] = await prisma.permission.findMany();
  const allNames: string[] = allPermissions.map((p) => p.name);

  const permByName: Record<string, Permission> = allPermissions.reduce<
    Record<string, Permission>
  >((acc, p) => {
    acc[p.name] = p;
    return acc;
  }, {});

  const rolePatterns: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: ["*"],
    [UserRole.PRINCIPAL]: [
      "struktur-organisasi.view",
      "ekstrakulikuler.view",
      "prestasi.siswa.*",
      "prestasi.sekolah.*",
      "prestasi.gtk.*",
      "program.kurikulum.view",
      "program.sarpras.view",
      "program.siswa.view",
      "program.humas.view",
      "program.jurusan.*.view",
      "program.jurusan.*.edit",
      "siswa.*",
      "guru.*",
      "mapel.*",
      "users.*",
    ],
    [UserRole.TEACHER]: [
      "ekstrakulikuler.view",
      "prestasi.siswa.view",
      "prestasi.siswa.*.view",
      "prestasi.sekolah.view",
      "prestasi.gtk.*.view",
      "program.kurikulum.view",
      "program.siswa.view",
      "program.jurusan.*.view",
    ],
  };

  const rolePermissionsData: Prisma.RolePermissionsCreateManyInput[] = [];

  const entries = Object.entries(rolePatterns) as [UserRole, string[]][];
  for (const [role, patterns] of entries) {
    const expanded: string[] = expandPatterns(patterns, allNames);
    for (const name of expanded) {
      const perm = permByName[name];
      if (perm) {
        rolePermissionsData.push({
          role,
          permissionId: perm.id,
        });
      } else {
        console.warn(
          `⚠️ Role mapping references permission not found: ${name}`
        );
      }
    }
  }

  if (rolePermissionsData.length > 0) {
    await prisma.rolePermissions.createMany({
      data: rolePermissionsData,
      skipDuplicates: true,
    });
    console.log(
      `🔁 RolePermissions populated (${rolePermissionsData.length} entries, skipDuplicates).`
    );
  } else {
    console.warn(
      "⚠️ No RolePermissions to create (rolePermissionsData empty)."
    );
  }

  const admin = await prisma.user.findUnique({
    where: { email: "admin@smkn4bdl.sch.id" },
  });

  if (admin) {
    const userPermData = allPermissions.map((p) => ({
      userId: admin.id,
      permissionId: p.id,
    }));

    if (userPermData.length > 0) {
      await prisma.userPermissions.createMany({
        data: userPermData,
        skipDuplicates: true,
      });
      console.log(`👑 All permissions assigned to Admin (${admin.email}).`);
    }
  } else {
    console.warn(
      "⚠️ Admin user not found — ensure userSeed ran before permissionSeed."
    );
  }

  console.log("✅ permissionSeed finished.");
};

const jurusanSeed = async () => {
  const jurusanData = [
    {
      kode: "PPLG",
      nama: "PPLG",
      nama_lengkap: "Pengembangan Perangkat Lunak dan Gim",
      deskripsi:
        "Program keahlian yang mempelajari pengembangan perangkat lunak, aplikasi mobile, web development, dan game development",
      image: null,
    },
    {
      kode: "AKL",
      nama: "AKL",
      nama_lengkap: "Akuntansi dan Keuangan Lembaga",
      deskripsi:
        "Program keahlian yang mempelajari akuntansi, perpajakan, dan manajemen keuangan lembaga",
      image: null,
    },
    {
      kode: "TKJ",
      nama: "TKJ",
      nama_lengkap: "Teknik Komputer dan Jaringan",
      deskripsi:
        "Program keahlian yang mempelajari instalasi, konfigurasi, dan maintenance jaringan komputer",
      image: null,
    },
    {
      kode: "DKV",
      nama: "DKV",
      nama_lengkap: "Desain Komunikasi Visual",
      deskripsi:
        "Program keahlian yang mempelajari desain grafis, multimedia, dan komunikasi visual",
      image: null,
    },
    {
      kode: "PHT",
      nama: "PHT",
      nama_lengkap: "Pengolahan Hasil Tani",
      deskripsi:
        "Program keahlian yang mempelajari pengolahan dan pengemasan hasil pertanian",
      image: null,
    },
    {
      kode: "MPLB",
      nama: "MPLB",
      nama_lengkap: "Manajemen Perkantoran dan Layanan Bisnis",
      deskripsi:
        "Program keahlian yang mempelajari administrasi perkantoran dan layanan bisnis",
      image: null,
    },
    {
      kode: "PM",
      nama: "PM",
      nama_lengkap: "Pemasaran",
      deskripsi:
        "Program keahlian yang mempelajari strategi pemasaran dan penjualan produk",
      image: null,
    },
    {
      kode: "UPW",
      nama: "UPW",
      nama_lengkap: "Usaha Perjalanan Wisata",
      deskripsi:
        "Program keahlian yang mempelajari manajemen perjalanan wisata dan pariwisata",
      image: null,
    },
    {
      kode: "KULINER",
      nama: "KULINER",
      nama_lengkap: "Kuliner",
      deskripsi:
        "Program keahlian yang mempelajari seni memasak dan manajemen usaha kuliner",
      image: null,
    },
    {
      kode: "BUSANA",
      nama: "BUSANA",
      nama_lengkap: "Tata Busana",
      deskripsi:
        "Program keahlian yang mempelajari desain dan pembuatan busana",
      image: null,
    },
  ];

  for (const jurusan of jurusanData) {
    await prisma.jurusan.upsert({
      where: { kode: jurusan.kode },
      update: {},
      create: jurusan,
    });
    console.log(`✅ Jurusan ${jurusan.nama} created`);
  }
};

const programSekolahSeed = async () => {
  const programKurikulum = await prisma.programSekolah.upsert({
    where: { id: "prog-kurikulum-1" },
    update: {},
    create: {
      id: "prog-kurikulum-1",
      judul: "Kurikulum Merdeka",
      deskripsi:
        "Implementasi Kurikulum Merdeka di SMK N 4 Bandar Lampung yang berfokus pada pengembangan kompetensi siswa melalui pembelajaran berbasis projek dan portofolio. Program ini dirancang untuk memberikan kebebasan kepada siswa dalam mengeksplorasi minat dan bakatnya.",
      tipe_program: "Kurikulum",
      thumbnail: "",
    },
  });
  console.log("✅ Program Kurikulum created:", programKurikulum);

  const programSarpras = await prisma.programSekolah.upsert({
    where: { id: "prog-sarpras-1" },
    update: {},
    create: {
      id: "prog-sarpras-1",
      judul: "Pengembangan Sarana dan Prasarana",
      deskripsi:
        "Program pengembangan dan peningkatan kualitas sarana prasarana sekolah untuk mendukung kegiatan pembelajaran yang optimal. Meliputi renovasi gedung, pengadaan peralatan laboratorium, dan digitalisasi sistem administrasi sekolah.",
      tipe_program: "Sarpras",
      thumbnail: "",
    },
  });
  console.log("✅ Program Sarpras created:", programSarpras);

  const programSiswa = await prisma.programSekolah.upsert({
    where: { id: "prog-siswa-1" },
    update: {},
    create: {
      id: "prog-siswa-1",
      judul: "Pengembangan Karakter Siswa",
      deskripsi:
        "Program pembinaan karakter dan soft skills siswa melalui berbagai kegiatan ekstrakurikuler, leadership training, dan program pengembangan diri. Bertujuan untuk membentuk siswa yang berakhlak mulia, mandiri, dan berprestasi.",
      tipe_program: "Siswa",
      thumbnail: "",
    },
  });
  console.log("✅ Program Siswa created:", programSiswa);

  const programHumas = await prisma.programSekolah.upsert({
    where: { id: "prog-humas-1" },
    update: {},
    create: {
      id: "prog-humas-1",
      judul: "Kerjasama Industri dan Hubungan Masyarakat",
      deskripsi:
        "Program pengembangan kerjasama dengan dunia industri dan dunia kerja (IDUKA) untuk meningkatkan relevansi pembelajaran dengan kebutuhan industri. Meliputi program magang, teaching factory, dan sertifikasi kompetensi.",
      tipe_program: "Humas",
      thumbnail: "",
    },
  });
  console.log("✅ Program Humas created:", programHumas);
};

async function main() {
  console.log("Starting seed...");

  await userSeed();
  await siswaSeed();
  await guruSeed();
  await mapelSeed();
  await guruAndMapelSeed();
  await permissionsSeed();
  await jurusanSeed();
  await programSekolahSeed();

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
