import { db } from "@/lib/db";
import { SCHEMA_STATEMENTS } from "@/lib/bootstrap-schema";
import { seedDemoData } from "@/lib/demo-seed";
import { syncMissingAcademyCourses } from "@/lib/academy-sync";

/**
 * RODLAB STUDIO — Auto-réparation de la base de données
 *
 * Garantit que la connexion fonctionne même si l'installation locale est
 * incomplète (base absente, schéma non créé, comptes de démonstration absents) :
 *  1. Si la table « User » n'existe pas → création du schéma complet (SQL embarqué).
 *  2. Si aucun utilisateur n'existe → recréation des comptes + données de démo.
 *
 * Appelé par authorize() (src/lib/auth.ts) à chaque tentative de connexion :
 * idempotent, sans effet (et quasi gratuit) si la base est déjà complète.
 */

let inFlight: Promise<void> | null = null;

async function runBootstrap() {
  // 1) Le schéma existe-t-il ?
  const tables = await db.$queryRawUnsafe<{ name: string }[]>(
    `SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' AND tablename = 'User'`
  );

  if (!tables || tables.length === 0) {
    console.log("[bootstrap] Schéma absent — création automatique des tables…");
    for (const statement of SCHEMA_STATEMENTS) {
      await db.$executeRawUnsafe(statement);
    }
    console.log("[bootstrap] Schéma créé (11 tables, 8 index).");
  }

  // 2) Les comptes existent-ils ?
  const userCount = await db.user.count();
  if (userCount === 0) {
    console.log("[bootstrap] Base vide — création automatique des données de démonstration…");
    await seedDemoData(db);
  }

  // 3) Mises à jour incrémentales du schéma (colonnes/tables ajoutées après la mise en
  // production initiale — sans effet si déjà appliquées, donc sûr à exécuter à chaque fois).
  try {
    await db.$executeRawUnsafe(`ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'TEXT'`);
    await db.$executeRawUnsafe(`ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "audioDuration" INTEGER`);
    await db.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "ChatPresence" ( "threadId" TEXT NOT NULL, "role" TEXT NOT NULL, "state" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL, PRIMARY KEY ("threadId", "role") )`
    );
    await db.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true`);
    await db.$executeRawUnsafe(`ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMP(3)`);
  } catch (error) {
    console.error("[bootstrap] Migration incrémentale échouée (non bloquant) :", error);
  }

  // 4) Cours ajoutés au catalogue après le seed initial (indépendant de userCount,
  // car le seed initial ne tourne qu'une fois : sans ça, un nouveau cours ajouté
  // au code n'apparaîtrait jamais en base sur une installation déjà peuplée).
  try {
    await syncMissingAcademyCourses(db);
  } catch (error) {
    console.error("[bootstrap] Synchronisation des cours échouée (non bloquant) :", error);
  }
}

/**
 * Appelé à chaque tentative de connexion : deux requêtes triviales quand la
 * base est saine (PostgreSQL, quelques ms) — et une réparation complète quand
 * elle ne l'est plus, aussi souvent que nécessaire (base vidée pendant
 * l'exécution, schéma recréé, etc.). Les appels concurrents partagent la même
 * exécution.
 */
export function ensureDatabaseReady(): Promise<void> {
  if (!inFlight) {
    inFlight = runBootstrap().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
