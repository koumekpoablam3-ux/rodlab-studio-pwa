import { db } from "@/lib/db";
import { InvoicesBoard } from "./invoices-board";

export const metadata = { title: "Factures" };
export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await db.invoice.findMany({
    include: { client: { select: { id: true, name: true, email: true, companyName: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-7xl">
      <InvoicesBoard initialInvoices={invoices} />
    </div>
  );
}
