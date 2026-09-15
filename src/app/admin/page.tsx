import Link from "next/link";
import { db } from "@/lib/db";
import { formatFCFA, formatFCFACompact, formatShortDate, timeAgo } from "@/lib/format";
import { PROJECT_STATUS_LABELS, REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, PROJECT_STATUS_COLORS } from "@/lib/roles";
import { StatCard, StatusBadge } from "@/components/shared";
import { RevenueChart, StatusDonut } from "@/components/charts/charts";
import { Banknote, Hourglass, FolderKanban, Users, FileText, Inbox, ArrowRight, MessageSquare, GraduationCap, Video } from "lucide-react";

export const metadata = { title: "Statistiques" };
export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const [invoices, projects, clientsCount, pendingQuotes, newRequests, recentRequests, recentMessages, academyEnrollments, academyCertificates] =
    await Promise.all([
      db.invoice.findMany({ select: { total: true, status: true, issueDate: true } }),
      db.project.findMany({ select: { status: true } }),
      db.user.count({ where: { role: { in: ["CLIENT", "ENTREPRISE"] } } }),
      db.quote.count({ where: { status: "SENT" } }),
      db.quoteRequest.count({ where: { status: "NEW" } }),
      db.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.message.findMany({
        where: { senderRole: { not: "ADMIN" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { sender: { select: { id: true, name: true, companyName: true, role: true } } },
      }),
      db.enrollment.count(),
      db.certificate.count(),
    ]);

  const paid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const pending = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);
  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "REVIEW").length;

  // Revenus par mois (8 derniers mois)
  const monthsData: { month: string; total: number }[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("fr-FR", { month: "short" });
    const total = invoices
      .filter((inv) => {
        const id = new Date(inv.issueDate);
        return inv.status === "PAID" && id.getFullYear() === d.getFullYear() && id.getMonth() === d.getMonth();
      })
      .reduce((s, inv) => s + inv.total, 0);
    monthsData.push({ month: label, total });
  }

  // Répartition projets
  const statusCounts = ["PENDING", "IN_PROGRESS", "REVIEW", "DELIVERED", "CANCELLED"].map((status) => ({
    name: PROJECT_STATUS_LABELS[status as keyof typeof PROJECT_STATUS_LABELS],
    value: projects.filter((p) => p.status === status).length,
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Statistiques</h1>
        <p className="mt-1 text-sm text-ink-500">Vue d&apos;ensemble de l&apos;activité de RodLab Studio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Banknote} label="Revenus encaissés" value={formatFCFACompact(paid)} hint="Factures payées" accent="forest" />
        <StatCard icon={Hourglass} label="En attente de paiement" value={formatFCFACompact(pending)} hint="Factures envoyées & en retard" accent="terra" />
        <StatCard icon={FolderKanban} label="Projets actifs" value={String(activeProjects)} hint={`${projects.length} projets au total`} accent="gold" />
        <StatCard icon={Users} label="Clients" value={String(clientsCount)} hint="Comptes client & entreprise" accent="ink" />
      </div>

      {/* RodLab Academy + Live */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/formation"
          className="flex items-center gap-4 rounded-2xl border border-forest-200 bg-forest-50 p-4 transition hover:bg-forest-100/70"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-cream-50">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink-900">RodLab Academy</span>
            <span className="mt-0.5 block text-xs text-ink-500">
              {academyEnrollments} apprenant(s) inscrit(s) · {academyCertificates} certificat(s) émis
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
        </Link>
        <Link
          href="/admin/live"
          className="flex items-center gap-4 rounded-2xl border border-terra-200 bg-terra-50/60 p-4 transition hover:bg-terra-100/70"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra-600 text-cream-50">
            <Video className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink-900">RodLab Live</span>
            <span className="mt-0.5 block text-xs text-ink-500">
              Gérer les sessions de formation à distance et les inscriptions
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-terra-700" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink-900">Revenus des 8 derniers mois</h2>
          <p className="mb-4 text-xs text-ink-400">Factures encaissées, TVA incluse</p>
          <RevenueChart data={monthsData} />
        </div>
        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink-900">Projets par statut</h2>
          <StatusDonut data={statusCounts} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">Dernières demandes de devis</h2>
            <Link href="/admin/demandes" className="flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
              Tout voir <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="divide-y divide-cream-200">
            {recentRequests.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{r.name}{r.company ? ` — ${r.company}` : ""}</p>
                  <p className="truncate text-xs text-ink-500">{r.message}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge label={REQUEST_STATUS_LABELS[r.status as keyof typeof REQUEST_STATUS_LABELS]} colorClass={REQUEST_STATUS_COLORS[r.status as keyof typeof REQUEST_STATUS_COLORS]} />
                  <span className="text-[11px] text-ink-300">{timeAgo(r.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">Derniers messages reçus</h2>
            <Link href="/admin/messagerie" className="flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
              Messagerie <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="divide-y divide-cream-200">
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-start gap-3 py-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cream-200">
                  <MessageSquare className="h-4 w-4 text-ink-500" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900">
                    {m.sender.role === "ENTREPRISE" ? m.sender.companyName || m.sender.name : m.sender.name}
                  </p>
                  <p className="truncate text-xs text-ink-500">{m.content}</p>
                  <p className="mt-0.5 text-[11px] text-ink-300">{timeAgo(m.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rappels rapides */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/demandes" className="group flex items-center gap-4 rounded-3xl border border-terra-200 bg-terra-50 p-5 transition hover:shadow-lift">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-terra-600 text-cream-50">
            <Inbox className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-ink-900">{newRequests}</p>
            <p className="text-xs text-ink-500">demandes à traiter</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-terra-500 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <Link href="/admin/devis" className="group flex items-center gap-4 rounded-3xl border border-gold-200 bg-gold-100/60 p-5 transition hover:shadow-lift">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500 text-forest-900">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-ink-900">{pendingQuotes}</p>
            <p className="text-xs text-ink-500">devis en attente de décision</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-gold-600 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <Link href="/admin/factures" className="group flex items-center gap-4 rounded-3xl border border-forest-200 bg-forest-50 p-5 transition hover:shadow-lift">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-600 text-cream-50">
            <Banknote className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-ink-900">{invoices.filter((i) => i.status === "OVERDUE").length}</p>
            <p className="text-xs text-ink-500">factures en retard</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-forest-600 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
