import { db } from "@/lib/db";
import { QuotesBoard } from "./quotes-board";

export const metadata = { title: "Devis" };
export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await db.quote.findMany({
    include: { client: { select: { id: true, name: true, email: true, companyName: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-7xl">
      <QuotesBoard initialQuotes={quotes} />
    </div>
  );
}
