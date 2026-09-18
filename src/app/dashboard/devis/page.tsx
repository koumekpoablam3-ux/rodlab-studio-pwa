import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuotesClient } from "./quotes-client";

export const metadata = { title: "Mes devis" };
export const dynamic = "force-dynamic";

export default async function DashboardQuotesPage() {
  const session = await getServerSession(authOptions);
  const quotes = await db.quote.findMany({
    where: { clientId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <QuotesClient quotes={quotes} />
    </div>
  );
}
