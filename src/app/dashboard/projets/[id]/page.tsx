import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, serviceTypeLabel, ProjectStatus } from "@/lib/roles";
import { StatusBadge, ProgressRing } from "@/components/shared";
import { ArrowLeft, CheckCircle2, Circle, CalendarDays, UserRound } from "lucide-react";

export const metadata = { title: "Détail du projet" };
export const dynamic = "force-dynamic";

export default async function DashboardProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/connexion");

  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { order: "asc" } },
      quotes: { select: { id: true, number: true, title: true, total: true, status: true } },
      invoices: { select: { id: true, number: true, total: true, status: true } },
    },
  });

  if (!project || project.clientId !== session.user.id) notFound();

  const doneCount = project.tasks.filter((t) => t.done).length;

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/dashboard/projets" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous mes projets
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink-900">{project.title}</h1>
                <p className="mt-1 text-sm text-ink-500">{serviceTypeLabel(project.serviceType)} · Démarré le {formatDate(project.startDate)}</p>
              </div>
              <StatusBadge label={PROJECT_STATUS_LABELS[project.status as ProjectStatus]} colorClass={PROJECT_STATUS_COLORS[project.status as ProjectStatus]} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">{project.description}</p>
            <div className="mt-6 flex items-center gap-4 border-t border-cream-200 pt-5">
              <ProgressRing value={project.progress} size={64} />
              <div>
                <p className="text-sm font-semibold text-ink-900">Avancement global</p>
                <p className="text-xs text-ink-500">
                  {project.deadline ? `Échéance prévue le ${formatDate(project.deadline)}` : "Échéance à définir avec l'équipe"}
                </p>
                {project.deliveredAt && <p className="mt-0.5 text-xs font-medium text-forest-600">✓ Livré le {formatDate(project.deliveredAt)}</p>}
              </div>
            </div>
          </div>

          {/* Jalons */}
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Étapes du projet</h2>
              <p className="text-xs text-ink-400">{doneCount}/{project.tasks.length} terminées</p>
            </div>
            <ul className="mt-4 space-y-2">
              {project.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl border border-cream-200 px-4 py-3">
                  {t.done ? <CheckCircle2 className="h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" /> : <Circle className="h-5 w-5 shrink-0 text-ink-300" aria-hidden="true" />}
                  <span className={t.done ? "text-sm text-ink-400 line-through" : "text-sm text-ink-900"}>{t.title}</span>
                </li>
              ))}
              {project.tasks.length === 0 && (
                <p className="py-4 text-center text-sm text-ink-400">Les étapes seront définies par l&apos;équipe RodLab.</p>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <UserRound className="h-5 w-5 text-terra-600" aria-hidden="true" /> Votre interlocuteur
            </h2>
            <p className="mt-3 text-sm text-ink-700">L&apos;équipe RodLab Studio</p>
            <p className="text-xs text-ink-500">Réponse sous 24 h ouvrées via la messagerie</p>
            <Link href="/dashboard/messagerie" className="mt-4 inline-flex items-center gap-1 rounded-full bg-terra-600 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-terra-700">
              Poser une question
            </Link>
          </div>

          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <CalendarDays className="h-5 w-5 text-forest-600" aria-hidden="true" /> Documents
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {project.quotes.map((q) => (
                <li key={q.id}>
                  <Link href="/dashboard/devis" className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-2.5 text-ink-700 transition hover:bg-cream-200">
                    <span>{q.number}</span>
                    <span className="font-semibold text-ink-900">{new Intl.NumberFormat("fr-FR").format(q.total)} FCFA</span>
                  </Link>
                </li>
              ))}
              {project.invoices.map((inv) => (
                <li key={inv.id}>
                  <Link href="/dashboard/factures" className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-2.5 text-ink-700 transition hover:bg-cream-200">
                    <span>{inv.number}</span>
                    <span className="font-semibold text-ink-900">{Intl.NumberFormat("fr-FR").format(inv.total)} FCFA</span>
                  </Link>
                </li>
              ))}
              {project.quotes.length === 0 && project.invoices.length === 0 && (
                <p className="py-2 text-center text-xs text-ink-400">Aucun document lié</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
