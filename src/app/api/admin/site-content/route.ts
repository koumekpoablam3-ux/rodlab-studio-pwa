import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  values: z.array(z.object({ key: z.string().min(1), value: z.string() })).min(1),
});

/** Contenu éditable du site public. */
export async function GET() {
  const contents = await db.siteContent.findMany({ orderBy: [{ section: "asc" }, { key: "asc" }] });
  return NextResponse.json({ contents });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    await Promise.all(
      parsed.data.values.map(({ key, value }) =>
        db.siteContent.update({ where: { key }, data: { value } })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SITE_CONTENT_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible d'enregistrer le contenu" }, { status: 500 });
  }
}
