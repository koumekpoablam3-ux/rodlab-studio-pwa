import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { formatDate } from "@/lib/format";

const itemSchema = z.object({ label: z.string().min(1), qty: z.number().positive(), unitPrice: z.number().nonnegative() });

const createSchema = z.object({
  title: z.string().min(2, "L'intitulé du devis est requis"),
  clientId: z.string().min(1, "Sélectionnez un client"),
  projectId: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, "Ajoutez au moins une ligne au devis"),
  taxRate: z.number().min(0).max(100).default(18),
  notes: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  sendNow: z.boolean().default(false),
});

function computeTotals(items: { qty: number; unitPrice: number }[], taxRate: number) {
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

async function nextQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.quote.count();
  return `DV-${year}-${String(count + 1).padStart(3, "0")}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { title, clientId, projectId, items, taxRate, notes, validUntil, sendNow } = parsed.data;
    const client = await db.user.findUnique({ where: { id: clientId } });
    if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

    const totals = computeTotals(items, taxRate);
    const number = await nextQuoteNumber();

    const quote = await db.quote.create({
      data: {
        number,
        title,
        clientId,
        projectId: projectId || null,
        items: JSON.stringify(items),
        taxRate,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        total: totals.total,
        status: sendNow ? "SENT" : "DRAFT",
        notes: notes || null,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    if (sendNow) {
      await notifyUser(clientId, {
        title: "Nouveau devis reçu",
        body: `Devis ${number} « ${title} » — ${new Intl.NumberFormat("fr-FR").format(totals.total)} FCFA. Valable jusqu'au ${formatDate(validUntil ? new Date(validUntil) : null)}.`,
        url: `/dashboard/devis/${quote.id}`,
        tag: "quote",
      });
    }

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("QUOTE_CREATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de créer le devis" }, { status: 500 });
  }
}
