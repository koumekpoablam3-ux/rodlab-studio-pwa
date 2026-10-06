import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { countUnread } from "@/lib/chat";
import { getAccess } from "@/lib/access";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  // Droits relus en base : compte suspendu, supprimé ou rétrogradé = effet immédiat.
  const access = await getAccess();
  if (!access || access.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream-100 p-6">
        <div className="max-w-md rounded-3xl border border-cream-300 bg-card p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-semibold text-ink-900">Accès suspendu</h1>
          <p className="mt-3 text-sm text-ink-500">
            Votre compte administrateur est suspendu ou n&apos;existe plus. Contactez le directeur de RodLab Studio.
          </p>
          <Link href="/api/auth/signout" className="mt-6 inline-flex rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-cream-50">
            Se déconnecter
          </Link>
        </div>
      </main>
    );
  }

  const [newRequests, unreadThreads] = await Promise.all([
    access.can("requests") ? db.quoteRequest.count({ where: { status: "NEW" } }) : Promise.resolve(0),
    countUnread(session.user.id),
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
        isDirector: access.isDirector,
      }}
      access={{ isDirector: access.isDirector, permissions: access.permissions }}
      badges={{ requests: newRequests, messages: unreadThreads }}
    >
      {children}
    </DashboardShell>
  );
}
