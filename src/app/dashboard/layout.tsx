import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { countUnread } from "@/lib/chat";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/connexion");

  const [unreadMessages, me] = await Promise.all([
    countUnread(session.user.id),
    db.user.findUnique({ where: { id: session.user.id }, select: { avatarUrl: true, avatarColor: true, name: true, companyName: true } }).catch(() => null),
  ]);

  return (
    <DashboardShell
      variant="client"
      user={{
        id: session.user.id,
        name: me?.name ?? session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role as "CLIENT" | "ENTREPRISE",
        avatarColor: me?.avatarColor ?? session.user.avatarColor,
        avatarUrl: me?.avatarUrl ?? null,
        companyName: me?.companyName ?? session.user.companyName,
      }}
      badges={{ messages: unreadMessages }}
    >
      {children}
    </DashboardShell>
  );
}
