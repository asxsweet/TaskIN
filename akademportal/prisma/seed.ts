import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { A, R } from "../lib/prisma-enums";

const prisma = new PrismaClient();

async function main() {
  await prisma.reviewHelpful.deleteMany();
  await prisma.review.deleteMany();
  await prisma.download.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.work.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.siteSettings.deleteMany();

  const facultiesData = [
    { name: "АТ факультеті" },
    { name: "Экономика" },
    { name: "Математика" },
    { name: "Педагогика" },
  ];

  const faculties = await Promise.all(
    facultiesData.map((f) => prisma.faculty.create({ data: f }))
  );

  const deptNames = [
    ["Информатика", "Ақпараттық жүйелер", "Киберқауіпсіздік"],
    ["Қаржы", "Маркетинг", "Менеджмент"],
    ["Математикалық талдау", "Статистика", "Математикалық модельдеу"],
    ["Бастапқы білім", "Психология", "Әдістеме"],
  ];

  let departmentCount = 0;
  for (let i = 0; i < faculties.length; i++) {
    for (const name of deptNames[i]) {
      await prisma.department.create({
        data: { name, facultyId: faculties[i].id },
      });
      departmentCount++;
    }
  }

  const hashAdmin = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Әкімші",
      email: "admin@taskin.kz",
      password: hashAdmin,
      role: R.ADMIN,
      facultyId: faculties[0].id,
      approvalStatus: A.APPROVED,
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: "default",
      siteName: "Task IN",
      tagline: "Білімді бөліс. Болашақты жаса.",
      logoUrl: null,
      emailFrom: "noreply@taskin.kz",
      contactEmail: "admin@taskin.kz",
      contactPhone: "",
      contactAddress: "",
      socialLinks: JSON.stringify([
        { label: "Instagram", url: "" },
        { label: "Telegram", url: "" },
        { label: "Facebook", url: "" },
      ]),
    },
  });

  console.log("Seed OK", {
    faculties: faculties.length,
    departments: departmentCount,
    users: 1,
    works: 0,
    adminEmail: admin.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
