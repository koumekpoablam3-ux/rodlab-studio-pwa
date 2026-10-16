import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/access";

/** Nouvel ordre d'affichage : la liste des identifiants dans l'ordre voulu. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin("content");
  if (!guard.ok) return guard.response;

  const parsed = z.object({ ids: z.array(z.string().min(1)).min(1).max(200) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  await db.$transaction(parsed.data.ids.map((id, position) => db.realisation.updateMany({ where: { id }, data: { position } })));
  revalidatePath("/", "layout");
  revalidatePath("/realisations");
  return NextResponse.json({ ok: true });
}
