import { db } from "@/lib/db";
import { TeamBoard } from "./team-board";

import { requirePermission } from "@/lib/access";
export const metadata = { title: "Équipe & comptes" };
export const dynamic = "force-dynamic";

export default async function AdminEquipePage() {
  await requirePermission("clients");
  const users = await db.user.findMany({
    where: { role: { not: "ADMIN" } },
    select: {
      id: true, name: true, email: true, role: true, phone: true, companyName: true,
      jobTitle: true, city: true, avatarColor: true, avatarUrl: true, createdAt: true,
      _count: { select: { projects: true, messages: true } },
    },
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
  });
  return (
    <div className="mx-auto max-w-7xl">
      <TeamBoard initialUsers={users} />
    </div>
  );
}
