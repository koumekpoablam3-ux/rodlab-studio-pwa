import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [newRequests, unreadThreads] = await Promise.all([
    db.quoteRequest.count({ where: { status: "NEW" } }),
    db.message.count({ where: { senderRole: { not: "ADMIN" }, readAt: null } }),
  ]);

  return (
    <DashboardShell
      variant="admin"
      user={{
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role,
        avatarColor: session.user.avatarColor,
      }}
      badges={{ requests: newRequests, messages: unreadThreads }}
    >
      {children}
    </DashboardShell>
  );
}
