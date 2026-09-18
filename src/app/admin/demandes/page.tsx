import { db } from "@/lib/db";
import { RequestBoard } from "./request-board";

export const metadata = { title: "Demandes de devis" };
export const dynamic = "force-dynamic";

export default async function AdminDemandesPage() {
  const requests = await db.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-7xl">
      <RequestBoard initialRequests={requests} />
    </div>
  );
}
