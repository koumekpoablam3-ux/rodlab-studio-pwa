import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

/**
 * Mot de passe oublié — 2e étape : définition du nouveau mot de passe.
 *
 * Vérifie le jeton reçu (hash SHA-256 en base, non expiré), remplace le mot
 * de passe (bcrypt, même coût que l'inscription) et invalide immédiatement
 * le jeton (usage unique). Un email de confirmation part ensuite, pour que
 * le titulaire du compte soit alerté si la modification ne vient pas de lui.
 *
 * Note : les sessions JWT déjà ouvertes restent valables jusqu'à leur
 * expiration naturelle (30 jours max) — comportement standard de NextAuth
 * en stratégie JWT, acceptable pour cette application.
 */
const schema = z.object({
  token: z.string().min(32, "Lien de réinitialisation invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const user = await db.user.findFirst({
      where: { resetTokenHash: tokenHash, resetTokenExpiry: { gt: new Date() } },
      select: { id: true, email: true, name: true, active: true },
    });

    if (!user || !user.active) {
      return NextResponse.json(
        {
          error:
            "Ce lien de réinitialisation est invalide, déjà utilisé ou expiré. Faites une nouvelle demande depuis la page « Mot de passe oublié ».",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiry: null, invitePending: false },
    });

    // Confirmation de sécurité : le titulaire sait que son mot de passe a changé.
    const firstName = user.name.trim().split(/\s+/)[0] || user.name;
    const body = `Bonjour ${firstName},\n\nLe mot de passe de votre compte RodLab Studio vient d'être modifié avec succès. Vous pouvez dès maintenant vous connecter avec votre nouveau mot de passe.\n\nSi vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement au +228 70 08 86 68 — votre compte sera sécurisé sans délai.`;

    await sendEmail(user.email, "Votre mot de passe RodLab Studio a été modifié", body, "/connexion", "Se connecter");

    return NextResponse.json({ ok: true, message: "Mot de passe modifié avec succès." });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
