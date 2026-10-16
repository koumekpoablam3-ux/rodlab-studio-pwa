import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";
import { z } from "zod";
import { db } from "@/lib/db";

// Clés autorisées : lettres, chiffres, points, tirets (ex: hero.title, team.members, real.kafo-market.image)
const keySchema = z.string().min(1).max(120).regex(/^[a-zA-Z0-9._-]+$/);

const updateSchema = z.object({
  values: z.array(z.object({ key: keySchema, value: z.string().max(60000) })).default([]),
  // Clés à rétablir à leur valeur d'origine (la ligne est supprimée : le site retombe sur le défaut)
  resetKeys: z.array(keySchema).default([]),
});

/** Contenu éditable du site public. */
export async function GET() {
  const contents = await db.siteContent.findMany({ orderBy: [{ section: "asc" }, { key: "asc" }] });
  return NextResponse.json({ contents });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    const { values, resetKeys } = parsed.data;

    // Les réglages « chat.* » (messagerie) sont réservés au directeur ; le reste demande le droit « contenu ».
    const touchesChat = [...values.map((v) => v.key), ...resetKeys].some((k) => k.startsWith("chat."));
    const guard = await requireAdmin(touchesChat ? "director" : "content");
    if (!guard.ok) return guard.response;

    await db.$transaction([
      // upsert : fonctionne aussi pour les nouvelles clés (photos, équipe, carrousel…)
      ...values.map(({ key, value }) =>
        db.siteContent.upsert({
          where: { key },
          update: { value },
          create: { key, value, section: key.split(".")[0], label: key, type: "TEXT" },
        })
      ),
      ...(resetKeys.length > 0 ? [db.siteContent.deleteMany({ where: { key: { in: resetKeys } } })] : []),
    ]);

    // Les pages publiques se mettent à jour immédiatement.
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SITE_CONTENT_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible d'enregistrer le contenu" }, { status: 500 });
  }
}
