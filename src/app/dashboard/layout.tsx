import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/connexion");

  const unreadMessages = await db.message.count({
    where: { threadId: session.user.id, senderRole: "ADMIN", readAt: null },
  });

  return (
    <DashboardShell
      variant="client"
      user={{
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role as "CLIENT" | "ENTREPRISE",
        avatarColor: session.user.avatarColor,
        companyName: session.user.companyName,
      }}
      badges={{ messages: unreadMessages }}
    >
      {children}
    </DashboardShell>
  );
}
