import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowLeft, CalendarDays, Clock, Users, Globe2, Video,
  MonitorPlay, Radio, ShieldCheck, ExternalLink, RadioTower, CircleAlert,
} from "lucide-react";
import { LiveRegisterButton } from "@/components/academy/live-register-button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const PLATFORM_LABELS: Record<string, string> = {
  ZOOM: "Zoom",
  MEET: "Google Meet",
  YOUTUBE: "YouTube Live",
  STREAMYARD: "StreamYard",
};

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lome",
  }).format(d);
}

/** Convertit les fuseaux courants pour l'affichage du rappel horaire. */
function otherTimezones(startsAt: Date) {
  const zones: { city: string; tz: string }[] = [
    { city: "Bruxelles / Paris", tz: "Europe/Brussels" },
    { city: "Montréal / New York", tz: "America/New_York" },
  ];
  return zones.map((z) => ({
    city: z.city,
    time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: z.tz }).format(startsAt),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const liveSession = await db.liveSession.findUnique({ where: { slug } });
  if (!liveSession) return { title: "Session live introuvable — RodLab Studio" };
  return {
    title: `${liveSession.title} — RodLab Live`,
    description: liveSession.summary,
  };
}

export default async function LiveSessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const liveSession = await db.liveSession.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });
  if (!liveSession) notFound();

  const session = await getServerSession(authOptions);
  const registration = session?.user?.id
    ? await db.liveRegistration.findUnique({
        where: { sessionId_userId: { sessionId: liveSession.id, userId: session.user.id } },
      })
    : null;

  const now = Date.now();
  const startsAt = liveSession.startsAt.getTime();
  const endsAt = startsAt + liveSession.durationMin * 60 * 1000;
  const joinWindowOpen = now >= startsAt - 15 * 60 * 1000;
  const isLive = liveSession.status === "LIVE" || (liveSession.status === "SCHEDULED" && now >= startsAt && now <= endsAt);
  const isPast = liveSession.status === "DONE" || now > endsAt;
  const isCancelled = liveSession.status === "CANCELLED";
  const full = liveSession._count.registrations >= liveSession.capacity;
  const remoteTimes = otherTimezones(liveSession.startsAt);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/live"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition hover:text-terra-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Toutes les sessions live
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* ————— Colonne principale ————— */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-700">
              {liveSession.platform === "YOUTUBE" || liveSession.platform === "STREAMYARD" ? (
                <Radio className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {PLATFORM_LABELS[liveSession.platform] ?? liveSession.platform}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                <RadioTower className="h-3.5 w-3.5" aria-hidden="true" /> EN DIRECT
              </span>
            )}
            {isPast && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-500">
                Session terminée
              </span>
            )}
            {isCancelled && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Annulée
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink-900 sm:text-3xl lg:text-4xl">
            {liveSession.title}
          </h1>

          <div className="mt-6 grid gap-3 rounded-2xl border border-cream-300 bg-white p-5 sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold text-ink-900 first-letter:uppercase">{formatDateTime(liveSession.startsAt)}</span>
                <span className="text-[11px] text-ink-400">heure de Lomé (GMT)</span>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold text-ink-900">{liveSession.durationMin} minutes</span>
                <span className="text-[11px] text-ink-400">
                  {remoteTimes.map((r) => `${r.city} : ${r.time}`).join(" · ")}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold text-ink-900">{liveSession._count.registrations} inscrits</span>
                <span className="text-[11px] text-ink-400">sur {liveSession.capacity} places</span>
              </span>
            </div>
          </div>

          {/* Corps : paragraphes puis puces */}
          <div className="mt-8 grid gap-4 text-sm leading-relaxed text-ink-700 sm:text-base">
            {liveSession.description.split("\n\n").map((para, i) => {
              if (para.startsWith("- ")) {
                return (
                  <ul key={i} className="grid gap-1.5">
                    {para.split("\n").map((line, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terra-600" aria-hidden="true" />
                        {line.slice(2)}
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{para}</p>;
            })}
          </div>
        </div>

        {/* ————— Colonne latérale : inscription ————— */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-cream-300 bg-cream-50 p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              {isPast ? "Replay & supports" : "Participer à la session"}
            </h2>

            {isPast ? (
              <div className="mt-4 grid gap-3">
                <p className="text-xs leading-relaxed text-ink-500">
                  Cette session a été diffusée{liveSession._count.registrations > 0 ? ` devant ${liveSession._count.registrations} inscrits` : ""}. Le replay est publié ci-dessous dès qu&apos;il est disponible — les inscrits reçoivent aussi les supports par notification.
                </p>
                {liveSession.embedUrl ? (
                  <div className="aspect-video overflow-hidden rounded-xl border border-cream-300 bg-ink-900">
                    <iframe
                      src={liveSession.embedUrl}
                      title={`Replay — ${liveSession.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-cream-400 bg-cream-100">
                    <p className="px-6 text-center text-xs text-ink-400">
                      Replay en préparation — revenez bientôt, il sera publié ici.
                    </p>
                  </div>
                )}
                <Link
                  href="/formation"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-3 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
                >
                  Suivre la formation complète <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                </Link>
              </div>
            ) : isCancelled ? (
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-red-700">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Cette session a été annulée par l&apos;équipe RodLab. Consultez /live pour les prochaines dates.
              </p>
            ) : !session?.user ? (
              <div className="mt-4 grid gap-3">
                <p className="text-xs leading-relaxed text-ink-500">
                  Créez un compte ou connectez-vous pour réserver votre place — c&apos;est gratuit, et vous recevrez
                  le rappel horaire et le replay.
                </p>
                <Link
                  href={`/connexion?callbackUrl=${encodeURIComponent(`/live/${liveSession.slug}`)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-terra-600 px-5 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-500"
                >
                  Se connecter pour s&apos;inscrire
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-cream-100"
                >
                  Créer un compte gratuit
                </Link>
              </div>
            ) : registration ? (
              <div className="mt-4 grid gap-3">
                <p className="flex items-start gap-2 rounded-xl bg-forest-50 p-3.5 text-xs leading-relaxed text-forest-800">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Votre inscription est confirmée. Le lien d&apos;accès s&apos;active ci-dessous 15 minutes avant le début — un rappel arrive aussi dans vos notifications.
                </p>
                {isLive && liveSession.joinUrl ? (
                  <a
                    href={liveSession.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
                  >
                    <Video className="h-4 w-4" aria-hidden="true" /> Rejoindre la salle maintenant
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-full bg-cream-200 px-5 py-3.5 text-sm font-semibold text-ink-400">
                    <Video className="h-4 w-4" aria-hidden="true" />
                    Salle accessible 15 min avant le début
                  </span>
                )}
              </div>
            ) : full ? (
              <p className="mt-4 rounded-xl bg-cream-200 p-3.5 text-xs leading-relaxed text-ink-500">
                Désolé, toutes les places sont prises. Inscrivez-vous à une prochaine session ou suivez la formation en autonomie sur /formation.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                <p className="text-xs leading-relaxed text-ink-500">
                  {liveSession.summary}
                </p>
                <LiveRegisterButton sessionId={liveSession.id} />
                <p className="flex items-center gap-2 text-[11px] text-ink-400">
                  <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Ouvert aux apprenants du monde entier
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-cream-300 pt-4">
              <p className="text-[11px] leading-relaxed text-ink-400">
                Une question ? Écrivez à <a className="text-terra-600 underline" href="mailto:contact@rodlabstudio.tg">contact@rodlabstudio.tg</a> ou appelez le +228 70 08 86 68.
              </p>
            </div>
          </div>

          {liveSession.joinUrl && registration && !isPast && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-400">
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              Le lien s&apos;ouvre dans une nouvelle fenêtre ({PLATFORM_LABELS[liveSession.platform] ?? liveSession.platform}).
            </p>
          )}
        </aside>
      </div>
    </article>
  );
}
