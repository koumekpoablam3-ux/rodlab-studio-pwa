import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildCommercialPdf } from "@/lib/commercial-pdf";
import { INVOICE_STATUS_LABELS } from "@/lib/roles";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, companyName: true, role: true, email: true, address: true, city: true, country: true } },
      project: { select: { title: true } },
    },
  });

  if (!invoice) return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  if (session.user.role !== "ADMIN" && invoice.clientId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const bytes = await buildCommercialPdf({
    kind: "FACTURE",
    number: invoice.number,
    client: invoice.client,
    items: [{ label: invoice.notes || "Prestation RodLab Studio", qty: 1, unitPrice: invoice.amount }],
    subtotal: invoice.amount,
    taxRate: invoice.taxRate,
    taxAmount: invoice.taxAmount,
    total: invoice.total,
    currency: invoice.currency,
    status: invoice.status,
    statusLabel: INVOICE_STATUS_LABELS[invoice.status as keyof typeof INVOICE_STATUS_LABELS] ?? invoice.status,
    notes: null, // déjà utilisé comme description de la ligne ci-dessus
    issueDate: invoice.issueDate,
    dueOrValidUntil: invoice.dueDate,
    dueOrValidLabel: "Échéance",
    paidAt: invoice.paidAt,
    projectTitle: invoice.project?.title ?? null,
  });

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
    },
  });
}
