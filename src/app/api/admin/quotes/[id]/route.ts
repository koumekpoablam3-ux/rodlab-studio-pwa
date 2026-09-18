import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REFUSED", "EXPIRED"]).optional(),
  notes: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
});

/**
 * PATCH : l'admin gère ses devis (envoi, expiration) ;
 * le client peut seulement ACCEPTER ou REFUSER un devis qui lui est adressé.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const quote = await db.quote.findUnique({ where: { id }, include: { client: true } });
  if (!quote) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = quote.clientId === session.user.id;

  if (!isAdmin && !isOwner) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  if (!isAdmin && parsed.data.status && !["ACCEPTED", "REFUSED"].includes(parsed.data.status)) {
    return NextResponse.json({ error: "Vous pouvez seulement accepter ou refuser ce devis" }, { status: 403 });
  }
  if (!isAdmin && quote.status !== "SENT") {
    return NextResponse.json({ error: "Ce devis n'est plus en attente de décision" }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "ACCEPTED" || parsed.data.status === "REFUSED") {
    data.decidedAt = new Date();
  }

  const updated = await db.quote.update({ where: { id }, data });

  // Notifications croisées
  if (isAdmin && parsed.data.status === "SENT" && quote.status === "DRAFT") {
    await notifyUser(quote.clientId, {
      title: "Nouveau devis reçu",
      body: `Devis ${quote.number} « ${quote.title} » — ${new Intl.NumberFormat("fr-FR").format(quote.total)} FCFA.`,
      url: `/dashboard/devis/${id}`,
      tag: "quote",
    });
  }
  if (!isAdmin && (parsed.data.status === "ACCEPTED" || parsed.data.status === "REFUSED")) {
    const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    const verdict = parsed.data.status === "ACCEPTED" ? "accepté" : "refusé";
    await Promise.all(
      admins.map((admin) =>
        notifyUser(admin.id, {
          title: `Devis ${verdict}`,
          body: `${quote.client.role === "ENTREPRISE" ? quote.client.companyName || quote.client.name : quote.client.name} a ${verdict} le devis ${quote.number}.`,
          url: `/admin/devis`,
          tag: "quote",
        })
      )
    );
  }

  return NextResponse.json({ quote: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await db.quote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }
}
