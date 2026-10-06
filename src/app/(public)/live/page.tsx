import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  Video, Globe2, CalendarDays, Clock, Users, ArrowRight,
  MonitorPlay, Radio, CalendarClock, CalendarCheck2,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { LiveRegisterButton } from "@/components/academy/live-register-button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "RodLab Live — Formations en direct, où que vous soyez",
  description:
    "Masterclass, ateliers pratiques et sessions Q&A en visioconférence avec l'équipe RodLab Studio. Pensé pour les apprenants hors du Togo : suivez nos formations en direct depuis n'importe quel pays.",
};

export const dynamic = "force-dynamic";

const PLATFORM_LABELS: Record<string, { label: string; icon: typeof Video }> = {
  ZOOM: { label: "Zoom", icon: MonitorPlay },
  MEET: { label: "Google Meet", icon: MonitorPlay },
  YOUTUBE: { label: "YouTube Live", icon: Radio },
  STREAMYARD: { label: "StreamYard", icon: Radio },
};

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lome",
  }).format(d);
}

export default async function LivePage() {
  const session = await getServerSession(authOptions);

  const sessions = await db.liveSession.findMany({
    orderBy: { startsAt: "asc" },
    include: { _count: { select: { registrations: true } } },
  });

  let myRegistrations = new Set<string>();
  if (session?.user?.id) {
    const regs = await db.liveRegistration.findMany({
      where: { userId: session.user.id },
      select: { sessionId: true },
    });
    myRegistrations = new Set(regs.map((r) => r.sessionId));
  }

  const now = new Date();
  const upcoming = sessions.filter(
    (s) => (s.status === "SCHEDULED" || s.status === "LIVE") && s.startsAt > new Date(now.getTime() - 2 * 60 * 60 * 1000)
  );
  const past = sessions.filter((s) => s.status === "DONE" || s.status === "CANCELLED" || s.startsAt <= new Date(now.getTime() - 2 * 60 * 60 * 1000)).reverse();

  return (
    <>
      <PageHero
        eyebrow="RodLab Live"
        title="La formation RodLab en direct, où que vous soyez dans le monde"
        description="Vous êtes en Europe, en Amérique, ailleurs en Afrique ? Suivez nos masterclass, ateliers de code et sessions de questions-réponses en visioconférence. Horaires pensés pour tous les fuseaux, replay envoyé aux inscrits."
        breadcrumbs={[{ label: "Live" }]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-forest-200 bg-white px-4 py-2.5 text-xs font-semibold text-forest-700">
            <Globe2 className="h-4 w-4" aria-hidden="true" /> Ouvert aux apprenants du monde entier
          </div>
          <div className="flex items-center gap-2 rounded-full border border-terra-200 bg-terra-50 px-4 py-2.5 text-xs font-semibold text-terra-700">
            <Video className="h-4 w-4" aria-hidden="true" /> Zoom · Meet · YouTube
          </div>
        </div>
      </PageHero>

      {/* Sessions à venir */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Prochaines sessions</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Réservez votre place en un clic
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
              L&apos;inscription est gratuite et se fait depuis votre compte RodLab. Le lien d&apos;accès est
              communiqué dans l&apos;application avant chaque session.
            </p>
          </div>
          {!session?.user && (
            <Link
              href="/connexion?callbackUrl=%2Flive"
              className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-6 py-3 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
            >
              Se connecter pour s&apos;inscrire <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {upcoming.map((s) => {
            const platform = PLATFORM_LABELS[s.platform] ?? PLATFORM_LABELS.ZOOM;
            const PlatformIcon = platform.icon;
            const isRegistered = myRegistrations.has(s.id);
            const full = s._count.registrations >= s.capacity;
            return (
              <article
                key={s.id}
                className="group flex flex-col rounded-3xl border border-cream-300 bg-white p-6 transition hover:border-forest-300 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-700">
                    <PlatformIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {platform.label}
                  </span>
                  {s.status === "LIVE" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                      EN DIRECT
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-ink-400">
                      {s._count.registrations}/{s.capacity} inscrits
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink-900">
                  <Link href={`/live/${s.slug}`} className="transition hover:text-terra-600">
                    {s.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-500 sm:text-sm">{s.summary}</p>

                <dl className="mt-5 grid gap-2 border-t border-cream-300 pt-4 text-xs text-ink-700">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
                    <span className="font-medium first-letter:uppercase">{formatDateTime(s.startsAt)} — heure de Lomé (GMT)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
                    <span>{s.durationMin} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
                    <span>{s.capacity} places · {full ? "complet" : "places disponibles"}</span>
                  </div>
                </dl>

                <div className="mt-5">
                  {!session?.user ? (
                    <Link
                      href={`/connexion?callbackUrl=${encodeURIComponent(`/live/${s.slug}`)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-forest-50 px-5 py-3 text-sm font-semibold text-forest-700 transition hover:bg-forest-100"
                    >
                      Se connecter pour s&apos;inscrire
                    </Link>
                  ) : isRegistered ? (
                    <Link
                      href={`/live/${s.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-5 py-3 text-sm font-semibold text-forest-700"
                    >
                      <CalendarCheck2 className="h-4 w-4" aria-hidden="true" /> Voir ma session
                    </Link>
                  ) : full ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream-200 px-5 py-3 text-sm font-semibold text-ink-400">
                      Session complète
                    </span>
                  ) : (
                    <LiveRegisterButton sessionId={s.id} compact />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Comment ça se passe */}
      <section className="woven-pattern border-y border-cream-300 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Le déroulé</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Quatre étapes, zéro complication
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarClock, title: "Choisissez une session", desc: "Les prochaines dates sont affichées avec l'heure de Lomé (GMT) — facile à convertir dans votre fuseau." },
              { icon: Users, title: "Inscrivez-vous", desc: "Un clic depuis votre compte RodLab. Vous recevez une confirmation instantanée dans l'application." },
              { icon: MonitorPlay, title: "Rejoignez le direct", desc: "Le bouton « Rejoindre » s'active 15 minutes avant le début, sur cette page ou dans votre espace." },
              { icon: Video, title: "Recevez le replay", desc: "Absent ? Les inscrits reçoivent l'enregistrement et les supports après la session." },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border border-cream-300 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions passées */}
      {past.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Réplays</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Sessions déjà diffusées
            </h2>
          </div>
          <div className="mt-8 grid gap-4">
            {past.map((s) => {
              const platform = PLATFORM_LABELS[s.platform] ?? PLATFORM_LABELS.ZOOM;
              return (
                <article
                  key={s.id}
                  className="flex flex-col gap-4 rounded-2xl border border-cream-300 bg-white p-6 sm:flex-row sm:items-center"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream-200 text-ink-400">
                    <platform.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-ink-900">
                      <Link href={`/live/${s.slug}`} className="transition hover:text-terra-600">{s.title}</Link>
                    </h3>
                    <p className="mt-1 text-xs text-ink-400">
                      {formatDateTime(s.startsAt)} · {s._count.registrations} inscrits
                    </p>
                  </div>
                  <Link
                    href={`/live/${s.slug}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cream-300 bg-cream-100 px-5 py-2.5 text-xs font-semibold text-ink-700 transition hover:bg-cream-200"
                  >
                    Voir la session <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <CtaBand
        title="Une question avant de rejoindre le live ?"
        text="Écrivez-nous : nous répondons sous 24 h, du Togo comme de l'étranger."
      />
    </>
  );
}
