import Link from "next/link";
import { db } from "@/lib/db";
import { formatFCFA, formatFCFACompact, formatShortDate, timeAgo } from "@/lib/format";
import { PROJECT_STATUS_LABELS, REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, PROJECT_STATUS_COLORS } from "@/lib/roles";
import { StatCard, StatusBadge } from "@/components/shared";
import { RevenueChart, StatusDonut } from "@/components/charts/charts";
import { Banknote, Hourglass, FolderKanban, Users, FileText, Inbox, ArrowRight, MessageSquare, GraduationCap, Video, Trophy, UserPlus, Receipt, FolderPlus, TrendingDown } from "lucide-react";
import { Avatar } from "@/components/brand";
import { cn } from "@/lib/utils";

export const metadata = { title: "Statistiques" };
export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const [invoices, projects, clientsCount, pendingQuotes, newRequests, recentRequests, recentMessages, academyEnrollments, academyCertificates, unreadMessagesTotal, topClientsRaw, totalRequests, sentQuotesCount, acceptedQuotesCount, suspendedCount] =
    await Promise.all([
      db.invoice.findMany({ select: { total: true, status: true, issueDate: true, clientId: true } }),
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
      db.message.count({ where: { senderRole: { not: "ADMIN" }, readAt: null } }),
      db.invoice.groupBy({
        by: ["clientId"],
        where: { status: "PAID" },
        _sum: { total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 5,
      }),
      db.quoteRequest.count(),
      db.quote.count({ where: { status: { in: ["SENT", "ACCEPTED", "REFUSED", "EXPIRED"] } } }),
      db.quote.count({ where: { status: "ACCEPTED" } }),
      db.user.count({ where: { role: { in: ["CLIENT", "ENTREPRISE"] }, active: false } }),
    ]);

  const topClientUsers = await db.user.findMany({
    where: { id: { in: topClientsRaw.map((t) => t.clientId) } },
    select: { id: true, name: true, companyName: true, role: true, avatarColor: true },
  });
  const topClients = topClientsRaw
    .map((t) => {
      const u = topClientUsers.find((u) => u.id === t.clientId);
      if (!u) return null;
      return {
        id: u.id,
        name: u.role === "ENTREPRISE" ? u.companyName || u.name : u.name,
        avatarColor: u.avatarColor,
        total: t._sum.total ?? 0,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null && t.total > 0);

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

  // Tunnel de conversion commercial : demande → devis envoyé → devis accepté
  const funnel = [
    { label: "Demandes reçues", value: totalRequests },
    { label: "Devis envoyés", value: sentQuotesCount },
    { label: "Devis acceptés", value: acceptedQuotesCount },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Statistiques</h1>
        <p className="mt-1 text-sm text-ink-500">Vue d&apos;ensemble de l&apos;activité de RodLab Studio.</p>
      </div>

      {/* Actions rapides */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/admin/clients", label: "Nouveau client", icon: UserPlus, color: "bg-forest-700" },
          { href: "/admin/devis", label: "Nouveau devis", icon: FileText, color: "bg-terra-600" },
          { href: "/admin/factures", label: "Nouvelle facture", icon: Receipt, color: "bg-gold-500" },
          { href: "/admin/projets", label: "Nouveau projet", icon: FolderPlus, color: "bg-ink-700" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-card p-3.5 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.color} text-cream-50`}>
              <a.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-ink-900">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Banknote} label="Revenus encaissés" value={formatFCFACompact(paid)} hint="Factures payées" accent="forest" />
        <StatCard icon={Hourglass} label="En attente de paiement" value={formatFCFACompact(pending)} hint="Factures envoyées & en retard" accent="terra" />
        <StatCard icon={FolderKanban} label="Projets actifs" value={String(activeProjects)} hint={`${projects.length} projets au total`} accent="gold" />
        <StatCard icon={Users} label="Clients" value={String(clientsCount)} hint={suspendedCount > 0 ? `dont ${suspendedCount} suspendu(s)` : "Comptes client & entreprise"} accent="ink" />
        <StatCard icon={MessageSquare} label="Messages non lus" value={String(unreadMessagesTotal)} hint="Tous fils confondus" accent="terra" />
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-4.5 w-4.5 text-terra-600" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink-900">Tunnel de conversion</h2>
          </div>
          <div className="space-y-3">
            {funnel.map((step, i) => {
              const prevValue = i === 0 ? step.value : funnel[i - 1].value;
              const pct = prevValue > 0 ? Math.round((step.value / prevValue) * 100) : 0;
              const widthPct = funnel[0].value > 0 ? Math.max(6, Math.round((step.value / funnel[0].value) * 100)) : 0;
              return (
                <div key={step.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-ink-600">{step.label}</span>
                    <span className="font-semibold text-ink-900">
                      {step.value} {i > 0 && <span className="font-normal text-ink-400">({pct}%)</span>}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-cream-200">
                    <div
                      className={cn("h-full rounded-full", i === 0 ? "bg-ink-400" : i === 1 ? "bg-terra-500" : "bg-forest-600")}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-ink-400">
            Taux de transformation global : {funnel[0].value > 0 ? Math.round((funnel[2].value / funnel[0].value) * 100) : 0}% des demandes reçues aboutissent à un devis accepté.
          </p>
        </div>

        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-4.5 w-4.5 text-gold-500" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink-900">Top clients par revenus encaissés</h2>
          </div>
          {topClients.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-400">Aucune facture payée pour le moment</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {topClients.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-cream-200 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-200 text-[11px] font-bold text-ink-600">
                    {i + 1}
                  </span>
                  <Avatar name={c.name} color={c.avatarColor} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-500">{formatFCFACompact(c.total)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
