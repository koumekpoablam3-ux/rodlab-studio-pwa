import { db } from "@/lib/db";
import { requirePermission } from "@/lib/access";
import { AdminsBoard } from "./admins-board";
import { EmailCheck } from "./email-check";
import { UsersBoard } from "./users-board";

export const metadata = { title: "Administrateurs" };
export const dynamic = "force-dynamic";

export default async function AdministrateursPage() {
  const me = await requirePermission("director");

  const myEmail = (await db.user.findUnique({ where: { id: me.id }, select: { email: true } }))?.email ?? "";
  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true, name: true, email: true, jobTitle: true, avatarColor: true, avatarUrl: true, active: true,
      isDirector: true, permissions: true, invitePending: true, lastSeenAt: true, createdAt: true,
    },
    orderBy: [{ isDirector: "desc" }, { createdAt: "asc" }],
  });

  const users = await db.user.findMany({
    where: { role: { not: "ADMIN" } },
    select: { id: true, name: true, email: true, role: true, companyName: true, avatarColor: true, avatarUrl: true, active: true, lastSeenAt: true },
    orderBy: { createdAt: "desc" },
    take: 500,
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
      <UsersBoard
        users={users.map((u) => ({ ...u, lastSeenAt: u.lastSeenAt ? u.lastSeenAt.toISOString() : null }))}
      />
      <EmailCheck defaultEmail={myEmail} />
    </div>
  );
}
