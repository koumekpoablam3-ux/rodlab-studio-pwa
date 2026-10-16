import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/access";
import { realisationSchema, toDbData } from "@/lib/realisation-schema";
import { uniqueSlug } from "@/lib/realisations";
import { REALISATIONS as DEFAULTS } from "@/lib/site-data-content";

const refresh = () => {
  revalidatePath("/", "layout");
  revalidatePath("/realisations");
};

/** Ajouter une réalisation (droit « Contenu du site »). */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin("content");
  if (!guard.ok) return guard.response;

  const parsed = realisationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  }
  try {
    const first = await db.realisation.findFirst({ orderBy: { position: "asc" }, select: { position: true } });
    const created = await db.realisation.create({
      data: { ...toDbData(parsed.data), title: parsed.data.title, slug: await uniqueSlug(parsed.data.title), position: (first?.position ?? 1) - 1 } as never,
      select: { id: true, slug: true },
    });
    refresh();
    return NextResponse.json({ realisation: created }, { status: 201 });
  } catch (error) {
    console.error("REALISATION_CREATE_ERROR", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la réalisation" }, { status: 500 });
  }
}

/** DELETE ?examples=1 : supprime d'un coup les 6 réalisations d'exemple livrées avec le projet. */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin("content");
  if (!guard.ok) return guard.response;
  if (new URL(req.url).searchParams.get("examples") !== "1") return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

  const res = await db.realisation.deleteMany({ where: { slug: { in: DEFAULTS.map((r) => r.slug) } } });
  refresh();
  return NextResponse.json({ ok: true, deleted: res.count });
}
