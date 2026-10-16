import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatFCFA, formatShortDate } from "@/lib/format";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, serviceTypeLabel, ProjectStatus } from "@/lib/roles";
import { EmptyState, StatusBadge, ProgressRing, PageHeader } from "@/components/shared";
import { FolderKanban, CalendarDays, ArrowRight, Plus } from "lucide-react";

export const metadata = { title: "Mes projets" };
export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage() {
  const session = await getServerSession(authOptions);
  const projects = await db.project.findMany({
    where: { clientId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const isEntreprise = session!.user.role === "ENTREPRISE";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={isEntreprise ? "Nos projets" : "Mes projets"}
        description="Suivez l'avancement de chaque projet en temps réel."
        actions={
          <a href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nouvelle demande
          </a>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Aucun projet pour l'instant"
          description="Parlez-nous de votre projet depuis la page d'accueil : nous revenons vers vous sous 24 h avec une proposition."
          action={
            <a href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3 text-sm font-semibold text-cream-50">
              Demander un devis <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projets/${p.id}`}
              className="group flex flex-col rounded-3xl border border-cream-300 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <StatusBadge label={PROJECT_STATUS_LABELS[p.status as ProjectStatus]} colorClass={PROJECT_STATUS_COLORS[p.status as ProjectStatus]} />
                <ProgressRing value={p.progress} size={48} />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{serviceTypeLabel(p.serviceType)}</p>
              <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{p.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-3 text-xs text-ink-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {p.deadline ? `Échéance ${formatShortDate(p.deadline)}` : "Sans échéance"}
                </span>
                {p.budget && <span className="font-semibold text-ink-700">{formatFCFA(p.budget)}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
