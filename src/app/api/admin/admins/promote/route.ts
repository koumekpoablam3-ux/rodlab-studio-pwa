import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/access";
import { PERMISSIONS, serializePermissions, parsePermissions } from "@/lib/permissions";
import { siteOrigin } from "@/lib/invite";
import { sendEmailStrict } from "@/lib/email";
import { notifyUser } from "@/lib/push";

const bodySchema = z.object({
  userId: z.string().min(1),
  jobTitle: z.string().trim().max(80).optional().nullable(),
  permissions: z.array(z.string()).default([]),
});

/**
 * Nomme administrateur un utilisateur EXISTANT (client / entreprise) — DIRECTEUR uniquement.
 * La personne garde son email et son mot de passe ; elle reçoit un email l'informant de sa nomination.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin("director");
  if (!guard.ok) return guard.response;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const { userId, jobTitle, permissions } = parsed.data;

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true, active: true } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (user.role === "ADMIN") return NextResponse.json({ error: "Cette personne est déjà administrateur." }, { status: 409 });
  if (!user.active) return NextResponse.json({ error: "Ce compte est suspendu : réactivez-le d'abord." }, { status: 409 });

  const saved = serializePermissions(permissions);
  await db.user.update({
    where: { id: user.id },
    data: { role: "ADMIN", permissions: saved, invitePending: false, invitedById: guard.user.id, ...(jobTitle ? { jobTitle } : {}) },
  });

  const sections = parsePermissions(saved).map((k) => PERMISSIONS.find((p) => p.key === k)?.label ?? k);
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const mail = await sendEmailStrict(
    user.email,
    "Vous êtes maintenant administrateur — RodLab Studio",
    `Bonjour ${firstName},\n\n${guard.user.name || "Le directeur"} vient de vous nommer administrateur de RodLab Studio.\n\n${
      sections.length > 0 ? `Vous avez accès à : ${sections.join(", ")}.` : "Vous avez accès à la messagerie et à votre profil."
    }\n\nConnectez-vous avec votre adresse email habituelle et votre mot de passe actuel. Si vous êtes déjà connecté(e), déconnectez-vous puis reconnectez-vous pour voir votre nouvel espace administrateur.`,
    `${siteOrigin(req)}/connexion`,
    "Accéder à mon espace"
  );
  // Notification dans l'application / sur le téléphone (sans second email)
  await notifyUser(user.id, {
    title: "Vous êtes maintenant administrateur",
    body: "Déconnectez-vous puis reconnectez-vous pour accéder à l'espace administrateur.",
    url: "/connexion",
    tag: "role",
    email: false,
  }).catch(() => {});

  return NextResponse.json({ ok: true, emailSent: mail.ok, emailError: mail.ok ? null : mail.reason });
}
