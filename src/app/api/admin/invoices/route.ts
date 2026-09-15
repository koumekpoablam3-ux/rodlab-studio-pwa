import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { formatDate } from "@/lib/format";

const createSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client"),
  projectId: z.string().optional().nullable(),
  quoteId: z.string().optional().nullable(),
  amount: z.number().positive("Le montant doit être positif"),
  taxRate: z.number().min(0).max(100).default(18),
  status: z.enum(["DRAFT", "SENT", "PAID"]).default("SENT"),
  method: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

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

    const client = await db.user.findUnique({ where: { id: parsed.data.clientId } });
    if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

    const year = new Date().getFullYear();
    const count = await db.invoice.count();
    const number = `FA-${year}-${String(count + 1).padStart(3, "0")}`;

    const taxAmount = Math.round(parsed.data.amount * (parsed.data.taxRate / 100));

    const invoice = await db.invoice.create({
      data: {
        number,
        clientId: parsed.data.clientId,
        projectId: parsed.data.projectId || null,
        quoteId: parsed.data.quoteId || null,
        amount: parsed.data.amount,
        taxRate: parsed.data.taxRate,
        taxAmount,
        total: parsed.data.amount + taxAmount,
        status: parsed.data.status,
        method: parsed.data.method || null,
        notes: parsed.data.notes || null,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        paidAt: parsed.data.status === "PAID" ? new Date() : null,
      },
    });

    if (parsed.data.status !== "DRAFT") {
      await notifyUser(client.id, {
        title: parsed.data.status === "PAID" ? "Facture réglée" : "Nouvelle facture",
        body: `Facture ${number} — ${new Intl.NumberFormat("fr-FR").format(invoice.total)} FCFA${
          invoice.dueDate ? ` à régler avant le ${formatDate(invoice.dueDate)}` : ""
        }.`,
        url: `/dashboard/factures/${invoice.id}`,
        tag: "invoice",
      });
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error("INVOICE_CREATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de créer la facture" }, { status: 500 });
  }
}
