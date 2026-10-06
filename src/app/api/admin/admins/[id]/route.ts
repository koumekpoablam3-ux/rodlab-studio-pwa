import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/access";
import { serializePermissions } from "@/lib/permissions";
import { issueSetupLink, sendSetupEmail } from "@/lib/invite";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  jobTitle: z.string().trim().max(80).optional().nullable(),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  permissions: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  /** Envoie un nouveau lien : invitation (compte jamais activé) ou réinitialisation. */
  action: z.literal("send-link").optional(),
});

/** Cible valide : un autre compte ADMIN qui n'est pas directeur. */
async function loadTarget(id: string, myId: string) {
  if (id === myId) return { error: NextResponse.json({ error: "Modifiez votre propre compte depuis « Mon profil »." }, { status: 400 }) };
  const target = await db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, isDirector: true, invitePending: true } });
  if (!target || target.role !== "ADMIN") return { error: NextResponse.json({ error: "Compte administrateur introuvable" }, { status: 404 }) };
  if (target.isDirector) return { error: NextResponse.json({ error: "Le compte directeur ne peut pas être modifié ici." }, { status: 403 }) };
  return { target };
}

/** Modifier un administrateur (droits, fonction, suspension, nouveau lien) — DIRECTEUR uniquement. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("director");
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const loaded = await loadTarget(id, guard.user.id);
  if ("error" in loaded) return loaded.error;
  const { target } = loaded;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const { permissions, action, ...rest } = parsed.data;

  try {
    if (action === "send-link") {
      const kind = target.invitePending ? "invite" : "reset";
      const { link } = await issueSetupLink(target.id, kind);
      const emailSent = await sendSetupEmail(target, link, kind, guard.user.name || "Le directeur");
      return NextResponse.json({ ok: true, inviteLink: link, emailSent, kind });
    }

    const data: Record<string, unknown> = { ...rest };
    if (permissions) data.permissions = serializePermissions(permissions);
    const user = await db.user.update({
      where: { id: target.id },
      data,
      select: { id: true, name: true, active: true, permissions: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("ADMIN_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de modifier le compte" }, { status: 500 });
  }
}

/** Supprimer un administrateur — DIRECTEUR uniquement (préférez « Suspendre » : l'historique est conservé). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("director");
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const loaded = await loadTarget(id, guard.user.id);
  if ("error" in loaded) return loaded.error;

  await db.user.delete({ where: { id: loaded.target.id } });
  return NextResponse.json({ ok: true });
}
