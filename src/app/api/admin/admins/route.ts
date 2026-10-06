import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/access";
import { serializePermissions } from "@/lib/permissions";
import { issueSetupLink, sendSetupEmail, siteOrigin } from "@/lib/invite";
import { AVATAR_COLORS } from "@/lib/roles";

// Adresses « de fonction » interdites : chaque administrateur doit avoir SON adresse personnelle.
const SHARED_LOCAL_PARTS = ["admin", "administrateur", "administrator", "directeur", "direction", "contact", "info", "infos", "support", "noreply", "no-reply", "accueil", "bureau", "equipe", "team", "hello", "bonjour"];

const createSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis").max(80),
  email: z.string().trim().toLowerCase().email("Adresse email invalide"),
  jobTitle: z.string().trim().max(80).optional().nullable(),
  permissions: z.array(z.string()).default([]),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

/** Création d'un compte administrateur par invitation — DIRECTEUR uniquement. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin("director");
  if (!guard.ok) return guard.response;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  }
  const { name, email, jobTitle, permissions, avatarColor } = parsed.data;

  if (SHARED_LOCAL_PARTS.includes(email.split("@")[0])) {
    return NextResponse.json(
      { error: "Utilisez l'adresse email personnelle de la personne (prenom.nom@…), pas une adresse commune comme contact@ ou admin@." },
      { status: 400 }
    );
  }
  if (await db.user.findFirst({ where: { email }, select: { id: true } })) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
  }

  try {
    // Mot de passe aléatoire que personne ne connaît : le compte reste inutilisable
    // tant que la personne n'a pas choisi le sien via son lien d'invitation.
    const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
        jobTitle: jobTitle || null,
        permissions: serializePermissions(permissions),
        invitePending: true,
        invitedById: guard.user.id,
        avatarColor: avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]!,
      },
      select: { id: true, name: true, email: true },
    });

    const { link } = await issueSetupLink(user.id, "invite", siteOrigin(req));
    const mail = await sendSetupEmail(user, link, "invite", guard.user.name || "Le directeur");
    return NextResponse.json({ user, inviteLink: link, emailSent: mail.sent, emailError: mail.reason ?? null }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_CREATE_ERROR", error);
    const detail = error instanceof Error ? error.message.replace(/\s+/g, " ").slice(-180) : "";
    return NextResponse.json({ error: "Impossible de créer le compte", detail }, { status: 500 });
  }
}
