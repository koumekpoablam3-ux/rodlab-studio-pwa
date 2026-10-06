import { db } from "@/lib/db";
import { requirePermission } from "@/lib/access";
import { AdminsBoard } from "./admins-board";

export const metadata = { title: "Administrateurs" };
export const dynamic = "force-dynamic";

export default async function AdministrateursPage() {
  const me = await requirePermission("director");

  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true, name: true, email: true, jobTitle: true, avatarColor: true, active: true,
      isDirector: true, permissions: true, invitePending: true, lastSeenAt: true, createdAt: true,
    },
    orderBy: [{ isDirector: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="mx-auto max-w-5xl">
      <AdminsBoard
        myId={me.id}
        admins={admins.map((a) => ({
          ...a,
          permissions: a.permissions,
          lastSeenAt: a.lastSeenAt ? a.lastSeenAt.toISOString() : null,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
