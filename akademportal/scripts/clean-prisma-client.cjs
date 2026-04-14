/**
 * prisma generate алдында node_modules/.prisma қалтасын жояды (Windows EPERM / rename қатесін азайту).
 * Алдымен: npm run dev және басқа node процестерін жабыңыз.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const prismaDir = path.join(root, "node_modules", ".prisma");
try {
  fs.rmSync(prismaDir, { recursive: true, force: true });
  console.log("Removed:", prismaDir);
} catch (e) {
  console.error("Could not remove .prisma (close dev server / Cursor terminal using node):", e.message);
  process.exit(1);
}
