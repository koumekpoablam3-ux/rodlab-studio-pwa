import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** Utilisateur connecté (id + rôle) ou null. */
export async function currentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  // Compte supprimé ou suspendu : la session (valable 30 jours) ne suffit plus.
  const account = await db.user.findUnique({ where: { id: session.user.id }, select: { active: true } }).catch(() => null);
  if (!account || !account.active) return null;
  return { id: session.user.id, role: session.user.role as string, name: session.user.name ?? "" };
}
