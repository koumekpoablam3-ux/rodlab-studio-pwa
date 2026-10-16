import { cache } from "react";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureDatabaseReady } from "@/lib/bootstrap";
import { parsePermissions, type Permission } from "@/lib/permissions";

export type Access = {
  id: string;
  name: string;
  role: string;
  isDirector: boolean;
  permissions: Permission[];
  can: (perm: Permission) => boolean;
};

/**
 * Droits de la personne connectée, relus en base à chaque requête : un changement de droits,
 * une suspension ou une suppression s'applique immédiatement (sans attendre l'expiration de la session).
 */
export const getAccess = cache(async (): Promise<Access | null> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const load = () =>
    db.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, role: true, active: true, isDirector: true, permissions: true } });
  // Mise à jour sans « prisma db push » : si les nouvelles colonnes manquent encore, on répare puis on réessaie.
  const user = await load().catch(async () => {
    await ensureDatabaseReady().catch(() => {});
    return load().catch(() => null);
  });
  if (!user || !user.active) return null;

  const isAdmin = user.role === "ADMIN";
  const permissions = isAdmin ? (user.isDirector ? parsePermissions(null) : parsePermissions(user.permissions)) : [];
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    isDirector: isAdmin && user.isDirector,
    permissions,
    can: (perm) => isAdmin && (user.isDirector || permissions.includes(perm)),
  };
});

/** Garde des routes API admin : `perm` = permission requise, ou "director" pour le directeur seul. */
export async function requireAdmin(perm?: Permission | "director") {
  const access = await getAccess();
  if (!access || access.role !== "ADMIN") {
    return { ok: false as const, response: NextResponse.json({ error: "Non autorisé" }, { status: 403 }) };
  }
  if (perm === "director" && !access.isDirector) {
    return { ok: false as const, response: NextResponse.json({ error: "Réservé au directeur" }, { status: 403 }) };
  }
  if (perm && perm !== "director" && !access.can(perm)) {
    return { ok: false as const, response: NextResponse.json({ error: "Vous n'avez pas la permission d'effectuer cette action." }, { status: 403 }) };
  }
  return { ok: true as const, access, user: { id: access.id, role: "ADMIN" as const, name: access.name } };
}

/** Garde des pages admin : redirige vers l'accueil admin si le droit manque. */
export async function requirePermission(perm: Permission | "director") {
  const access = await getAccess();
  if (!access) redirect("/connexion");
  if (access.role !== "ADMIN") redirect("/dashboard");
  const allowed = perm === "director" ? access.isDirector : access.can(perm);
  if (!allowed) redirect("/admin?acces=refuse");
  return access;
}

/** Pour les routes partagées (propriétaire OU admin) : l'admin a-t-il ce droit ? */
export async function adminCan(userId: string, role: string, perm: Permission) {
  if (role !== "ADMIN") return false;
  const access = await getAccess();
  return !!access && access.id === userId && access.can(perm);
}
