/**
 * RODLAB STUDIO — CLI de re-seed (source)
 * Compilé en JavaScript pur :  npx -y esbuild scripts/seed.ts --bundle --platform=node --format=cjs --target=node18 --external:@prisma/client --outfile=scripts/seed-lib.js
 * Puis lancé par scripts/seed.js (npm run seed) — aucun besoin de Bun ou tsx.
 */
import { PrismaClient } from "@prisma/client";
import { seedDemoData } from "../src/lib/demo-seed";

async function main() {
  const db = new PrismaClient();
  try {
    await seedDemoData(db);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error("[seed] Échec :", error);
  console.error("[seed] Vérifiez que le client Prisma est généré :  npm run db:generate");
  process.exit(1);
});
