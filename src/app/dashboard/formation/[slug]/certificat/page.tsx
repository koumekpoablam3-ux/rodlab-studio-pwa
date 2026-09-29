import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Award, Download, ShieldCheck, CalendarDays, Lock } from "lucide-react";

const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://rodlab-studio-pwa.vercel.app")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Mon certificat — RodLab Academy" };
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export default async function CertificatePage({ params }: Params) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const course = await db.course.findUnique({ where: { slug }, select: { id: true, published: true } });
  if (!course || !course.published) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    include: { certificate: true, course: { select: { title: true } } },
  });

  const cert = enrollment?.certificate;

  if (!cert) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/dashboard/formation/${course.id ? slug : ""}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition hover:text-terra-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Ma formation
        </Link>
        <div className="mt-5 rounded-3xl border border-cream-300 bg-cream-100 p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200 text-ink-400">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-900">Certificat non encore émis</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
            Terminez tous les modules, réussissez l&apos;examen final (70 % minimum) et votre certificat apparaîtra
            ici, prêt à être téléchargé et partagé.
          </p>
          <Link
            href={`/dashboard/formation/${slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
          >
            Retourner à ma formation
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(cert.issuedAt);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href={`/dashboard/formation/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition hover:text-terra-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Ma formation
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Mon certificat</h1>
          <p className="mt-1 text-sm text-ink-500">
            Obtenu le {dateStr} · score {cert.score} % · code{" "}
            <span className="font-mono font-semibold text-forest-800">{cert.code}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/formation/certificat/${cert.code}`}
            className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Télécharger le PDF
          </a>
          <Link
            href={`/certificats/${cert.code}`}
            className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-5 py-3.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Page de vérification
          </Link>
        </div>
      </div>

      {/* Aperçu du certificat */}
      <div className="mt-6 overflow-hidden rounded-3xl border-2 border-forest-700 bg-cream-50">
        <div className="bg-forest-900 px-6 py-5 text-center sm:px-10">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <Award className="h-4 w-4" aria-hidden="true" /> RodLab Studio · Academy
          </p>
          <p className="mt-1 text-[11px] text-forest-100/60">Lomé — Togo · {SITE_HOST}</p>
        </div>
        <div className="px-6 py-10 text-center sm:px-12">
          <h2 className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">Certificat de réussite</h2>
          <div className="mx-auto mt-3 h-0.5 w-28 bg-gold-400" aria-hidden="true" />
          <p className="mt-8 text-xs uppercase tracking-widest text-ink-400">Délivré avec fierté à</p>
          <p className="mt-2 font-display text-3xl font-semibold text-terra-600 sm:text-4xl">{cert.holderName}</p>
          <p className="mt-6 text-sm leading-relaxed text-ink-500">
            pour avoir suivi avec succès l&apos;intégralité de la formation
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-forest-900">« {enrollment.course.title} »</p>
          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-cream-300 bg-white p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Score final</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink-900">{cert.score} %</p>
            </div>
            <div className="rounded-xl border border-cream-300 bg-white p-3.5">
              <p className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <CalendarDays className="h-3 w-3" aria-hidden="true" /> Émis le
              </p>
              <p className="mt-1 font-display text-sm font-semibold leading-5 text-ink-900">{dateStr}</p>
            </div>
            <div className="rounded-xl border border-gold-400/60 bg-white p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">Code</p>
              <p className="mt-1 font-mono text-sm font-semibold text-forest-900">{cert.code}</p>
            </div>
          </div>
          <p className="mt-8 text-xs italic text-ink-400">
            K.A.S. Rodrigue — Fondateur & Directeur créatif, RodLab Studio
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Le PDF est régénéré à chaque téléchargement avec les informations officielles de votre certificat — vous
        pouvez le télécharger autant de fois que nécessaire. Pour partager une preuve d&apos;authenticité, envoyez
        simplement le lien de la page de vérification : {SITE_HOST}/certificats/{cert.code}.
      </p>
    </div>
  );
}
