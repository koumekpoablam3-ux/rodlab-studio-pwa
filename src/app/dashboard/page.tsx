import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatFCFA, formatFCFACompact, formatShortDate, timeAgo } from "@/lib/format";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from "@/lib/roles";
import { StatCard, StatusBadge, ProgressRing, EmptyState } from "@/components/shared";
import { FolderKanban, FileText, Receipt, MessageSquare, ArrowRight, Plus, GraduationCap } from "lucide-react";

export const metadata = { title: "Vue d'ensemble" };
export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  const clientId = session!.user.id;

  const [projects, quotes, invoices, unreadCount, lastMessages, enrollment] = await Promise.all([
    db.project.findMany({ where: { clientId }, orderBy: { updatedAt: "desc" } }),
    db.quote.findMany({ where: { clientId }, orderBy: { createdAt: "desc" }, take: 4 }),
    db.invoice.findMany({ where: { clientId }, orderBy: { issueDate: "desc" }, take: 4 }),
    db.message.count({ where: { threadId: clientId, senderRole: "ADMIN", readAt: null } }),
    db.message.findMany({ where: { threadId: clientId }, orderBy: { createdAt: "desc" }, take: 3 }),
    db.enrollment.findFirst({
      where: { userId: clientId, course: { published: true } },
      include: { certificate: true },
    }),
  ]);

  // Progression formation (course unique publiée)
  let formationPercent: number | null = null;
  if (enrollment) {
    const [totalLessons, doneLessons] = await Promise.all([
      db.lesson.count({ where: { module: { courseId: enrollment.courseId } } }),
      db.lessonProgress.count({
        where: { userId: clientId, lesson: { module: { courseId: enrollment.courseId } } },
      }),
    ]);
    formationPercent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
  }

  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "REVIEW");
  const pendingQuotes = quotes.filter((q) => q.status === "SENT").length;
  const dueInvoices = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE");
  const totalDue = dueInvoices.reduce((s, i) => s + i.total, 0);
  const displayName = session!.user.role === "ENTREPRISE" && session!.user.companyName ? session!.user.companyName : session!.user.name ?? "";

  return (
    <div className="mx-auto max-w-7xl">
      {/* Bandeau d'accueil */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-forest-900 p-6 text-cream-100 sm:p-8">
        <p className="text-sm text-forest-100/70">Bonjour 👋</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">{displayName}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-100/80">
          {activeProjects.length > 0
            ? `Vous avez ${activeProjects.length} projet(s) en cours. L'équipe RodLab avance sur vos livrables — suivez l'avancement ci-dessous.`
            : "Bienvenue dans votre espace. Contactez-nous pour lancer votre premier projet avec RodLab Studio."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/dashboard/projets" className="inline-flex items-center gap-1.5 rounded-full bg-terra-600 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-terra-700">
            Mes projets <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link href="/dashboard/messagerie" className="inline-flex items-center gap-1.5 rounded-full border border-forest-700 px-4 py-2 text-xs font-semibold text-cream-100 transition hover:bg-forest-800">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            Messagerie {unreadCount > 0 && `(${unreadCount})`}
          </Link>
          <a href="/#contact" className="inline-flex items-center gap-1.5 rounded-full border border-forest-700 px-4 py-2 text-xs font-semibold text-cream-100 transition hover:bg-forest-800">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Nouveau projet
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FolderKanban} label="Projets en cours" value={String(activeProjects.length)} hint={`${projects.length} au total`} accent="terra" />
        <StatCard icon={FileText} label="Devis à décider" value={String(pendingQuotes)} hint="En attente de votre validation" accent="gold" />
        <StatCard icon={Receipt} label="Montant à régler" value={formatFCFACompact(totalDue)} hint={`${dueInvoices.length} facture(s)`} accent="forest" />
        <StatCard icon={MessageSquare} label="Messages non lus" value={String(unreadCount)} hint="De l'équipe RodLab" accent="ink" />
      </div>

      {/* RodLab Academy */}
      {formationPercent !== null ? (
        <Link
          href="/dashboard/formation"
          className="mt-4 flex items-center gap-4 rounded-2xl border border-forest-200 bg-forest-50 p-4 transition hover:bg-forest-100/70"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-cream-50">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink-900">RodLab Academy — ma formation</span>
            <span className="mt-0.5 block text-xs text-ink-500">
              {formationPercent === 100
                ? "Parcours terminé — passez l'examen final pour décrocher votre certificat !"
                : `Parcours à ${formationPercent} % — reprenez où vous étiez.`}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
        </Link>
      ) : (
        <Link
          href="/dashboard/formation"
          className="mt-4 flex items-center gap-4 rounded-2xl border border-gold-400/50 bg-gold-100/40 p-4 transition hover:bg-gold-100/70"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-forest-900">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink-900">Nouveau — RodLab Academy</span>
            <span className="mt-0.5 block text-xs text-ink-500">
              Formation en ligne gratuite certifiante : 8 modules, examen final et certificat PDF vérifiable.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
        </Link>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Projets en cours */}
        <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">Vos projets</h2>
            <Link href="/dashboard/projets" className="flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
              Tout voir <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="Aucun projet pour l'instant"
              description="Envoyez-nous votre demande depuis la page d'accueil : votre projet apparaîtra ici."
            />
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/projets/${p.id}`} className="flex items-center gap-4 rounded-2xl border border-cream-200 p-4 transition hover:border-terra-200 hover:bg-terra-50/40">
                    <ProgressRing value={p.progress} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{p.title}</p>
                      <p className="text-xs text-ink-500">
                        {p.deadline ? `Échéance : ${formatShortDate(p.deadline)}` : "Sans échéance"}
                      </p>
                    </div>
                    <StatusBadge label={PROJECT_STATUS_LABELS[p.status as keyof typeof PROJECT_STATUS_LABELS]} colorClass={PROJECT_STATUS_COLORS[p.status as keyof typeof PROJECT_STATUS_COLORS]} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          {/* Devis récents */}
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Derniers devis</h2>
              <Link href="/dashboard/devis" className="flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
                Tout voir <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <ul className="divide-y divide-cream-100">
              {quotes.map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{q.title}</p>
                    <p className="text-xs text-ink-500">{q.number} · {formatFCFA(q.total)}</p>
                  </div>
                  <StatusBadge label={QUOTE_STATUS_LABELS[q.status as keyof typeof QUOTE_STATUS_LABELS]} colorClass={QUOTE_STATUS_COLORS[q.status as keyof typeof QUOTE_STATUS_COLORS]} />
                </li>
              ))}
              {quotes.length === 0 && <p className="py-4 text-center text-sm text-ink-400">Aucun devis</p>}
            </ul>
          </div>

          {/* Factures récentes */}
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Dernières factures</h2>
              <Link href="/dashboard/factures" className="flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
                Tout voir <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <ul className="divide-y divide-cream-100">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900">{inv.number}</p>
                    <p className="text-xs text-ink-500">{formatFCFA(inv.total)}</p>
                  </div>
                  <StatusBadge label={INVOICE_STATUS_LABELS[inv.status as keyof typeof INVOICE_STATUS_LABELS]} colorClass={INVOICE_STATUS_COLORS[inv.status as keyof typeof INVOICE_STATUS_COLORS]} />
                </li>
              ))}
              {invoices.length === 0 && <p className="py-4 text-center text-sm text-ink-400">Aucune facture</p>}
            </ul>
          </div>
        </div>
      </div>

      {/* Derniers messages */}
      {lastMessages.length > 0 && (
        <div className="mt-6 rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">Derniers échanges</h2>
            <Link href="/dashboard/messagerie" className="flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
              Ouvrir la messagerie <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="space-y-2.5">
            {lastMessages.map((m) => (
              <li key={m.id} className="rounded-2xl bg-cream-100 px-4 py-3">
                <p className="text-xs font-semibold text-ink-500">
                  {m.senderRole === "ADMIN" ? "RodLab Studio" : "Vous"} · {timeAgo(m.createdAt)}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-ink-700">{m.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
