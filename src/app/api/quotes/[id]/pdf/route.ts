import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildCommercialPdf } from "@/lib/commercial-pdf";
import { QUOTE_STATUS_LABELS } from "@/lib/roles";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const quote = await db.quote.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, companyName: true, role: true, email: true, address: true, city: true, country: true } },
      project: { select: { title: true } },
    },
  });

  if (!quote) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (session.user.role !== "ADMIN" && quote.clientId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  let items: { label: string; qty: number; unitPrice: number }[] = [];
  try {
    items = JSON.parse(quote.items);
  } catch {
    items = [{ label: quote.title, qty: 1, unitPrice: quote.subtotal }];
  }

  const bytes = await buildCommercialPdf({
    kind: "DEVIS",
    number: quote.number,
    title: quote.title,
    client: quote.client,
    items,
    subtotal: quote.subtotal,
    taxRate: quote.taxRate,
    taxAmount: quote.taxAmount,
    total: quote.total,
    currency: quote.currency,
    status: quote.status,
    statusLabel: QUOTE_STATUS_LABELS[quote.status as keyof typeof QUOTE_STATUS_LABELS] ?? quote.status,
    notes: quote.notes,
    issueDate: quote.createdAt,
    dueOrValidUntil: quote.validUntil,
    dueOrValidLabel: "Valable jusqu'au",
    paidAt: null,
    projectTitle: quote.project?.title ?? null,
  });

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quote.number}.pdf"`,
    },
  });
}
