import { db } from "@/lib/db";
import { ClientsBoard } from "./clients-board";

import { requirePermission } from "@/lib/access";
export const metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  await requirePermission("clients");
  const users = await db.user.findMany({
    where: { role: { in: ["CLIENT", "ENTREPRISE"] } },
    select: {
      id: true, name: true, email: true, role: true, phone: true, companyName: true,
      jobTitle: true, city: true, avatarColor: true, avatarUrl: true, active: true, createdAt: true,
      _count: { select: { projects: true, quotes: true, invoices: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <ClientsBoard initialUsers={users} />
    </div>
  );
}
