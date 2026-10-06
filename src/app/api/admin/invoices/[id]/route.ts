import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  method: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const invoice = await db.invoice.findUnique({ where: { id } });
    if (!invoice) return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });

    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "PAID" && invoice.status !== "PAID") data.paidAt = new Date();

    const updated = await db.invoice.update({ where: { id }, data });

    if (parsed.data.status === "PAID" && invoice.status !== "PAID") {
      await notifyUser(invoice.clientId, {
        title: "Paiement confirmé",
        body: `Votre facture ${invoice.number} a été marquée comme payée. Merci !`,
        url: `/dashboard/factures/${id}`,
        tag: "invoice",
      });
    }

    return NextResponse.json({ invoice: updated });
  } catch (error) {
    console.error("INVOICE_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de modifier la facture" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await db.invoice.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }
}
