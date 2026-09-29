import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { InvoicesClient } from "./invoices-client";

export const metadata = { title: "Mes factures" };
export const dynamic = "force-dynamic";

export default async function DashboardInvoicesPage() {
  const session = await getServerSession(authOptions);
  const invoices = await db.invoice.findMany({
    where: { clientId: session!.user.id },
    orderBy: { issueDate: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <InvoicesClient invoices={invoices} />
    </div>
  );
}
