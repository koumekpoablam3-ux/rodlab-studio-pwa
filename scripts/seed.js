/**
 * RODLAB STUDIO — Re-seed des données de démonstration (JavaScript pur, sans Bun)
 *
 * Usage :  npm run seed
 * Prérequis : npm install (génère le client Prisma) — le schéma est créé
 *             automatiquement s'il manque (npm run db:push le crée aussi).
 */

const { PrismaClient } = require("@prisma/client");

async function main() {
  // Import dynamique du module compilé depuis src/lib/demo-seed.ts
  const { seedDemoData } = require("./seed-lib.js");
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
