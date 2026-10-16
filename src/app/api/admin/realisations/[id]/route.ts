import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/access";
import { realisationSchema, toDbData } from "@/lib/realisation-schema";

const refresh = () => {
  revalidatePath("/", "layout");
  revalidatePath("/realisations");
};

/** Modifier une réalisation (tout ou partie des champs, ex. seulement « publié »). */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("content");
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const parsed = realisationSchema.partial().safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  }
  try {
    await db.realisation.update({ where: { id }, data: toDbData(parsed.data) as never });
    refresh();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("REALISATION_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Réalisation introuvable ou non enregistrée" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("content");
  if (!guard.ok) return guard.response;
  const { id } = await params;

  await db.realisation.deleteMany({ where: { id } });
  refresh();
  return NextResponse.json({ ok: true });
}
