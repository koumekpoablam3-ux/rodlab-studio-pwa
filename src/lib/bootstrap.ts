import { db } from "@/lib/db";
import { SCHEMA_STATEMENTS } from "@/lib/bootstrap-schema";
import { seedDemoData } from "@/lib/demo-seed";

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
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'`
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
}

/**
 * Appelé à chaque tentative de connexion : deux requêtes triviales quand la
 * base est saine (SQLite, ~1 ms) — et une réparation complète quand elle ne
 * l'est plus, aussi souvent que nécessaire (base vidée pendant l'exécution,
 * schéma recréé, etc.). Les appels concurrents partagent la même exécution.
 */
export function ensureDatabaseReady(): Promise<void> {
  if (!inFlight) {
    inFlight = runBootstrap().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
