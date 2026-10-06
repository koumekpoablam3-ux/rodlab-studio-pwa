import type { Metadata } from "next";
import Link from "next/link";
import {
  Award, BadgeCheck, Download, ShieldCheck, CircleX, CalendarDays, GraduationCap,
} from "lucide-react";
import { db } from "@/lib/db";

const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://rodlab-studio-pwa.vercel.app")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

export const dynamic = "force-dynamic";

async function getCertificate(code: string) {
  const clean = decodeURIComponent(code).trim().toUpperCase();
  return db.certificate.findUnique({
    where: { code: clean },
    include: { course: { select: { title: true, slug: true } } },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const cert = await getCertificate(code);
  if (!cert) return { title: "Certificat introuvable — RodLab Studio" };
  return {
    title: `Certificat ${cert.code} — ${cert.holderName} | RodLab Studio`,
    description: `Vérification d'authenticité : ${cert.holderName} a obtenu le certificat RodLab Academy pour la formation « ${cert.course.title} » avec un score de ${cert.score} %.`,
  };
}

export default async function CertificateVerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await getCertificate(code);

  if (!cert) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center sm:p-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <CircleX className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink-900">Certificat introuvable</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
            Aucun certificat RodLab ne correspond au code <span className="font-mono font-semibold">{decodeURIComponent(code).toUpperCase()}</span>. Vérifiez la saisie, ou contactez-nous si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
          >
            Contacter RodLab Studio
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(cert.issuedAt);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Bandeau d'authenticité */}
      <div className="flex items-center gap-3 rounded-2xl border border-forest-200 bg-forest-50 p-4">
        <ShieldCheck className="h-6 w-6 shrink-0 text-forest-700" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-forest-800">
          <strong>Certificat authentique.</strong> Ce document a bien été émis par RodLab Studio et son
          authenticité est confirmée à l&apos;instant.
        </p>
      </div>

      {/* Aperçu du certificat */}
      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-forest-700 bg-cream-50">
        <div className="bg-forest-900 px-6 py-5 text-center sm:px-10">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <Award className="h-4 w-4" aria-hidden="true" /> RodLab Studio · Academy
          </p>
          <p className="mt-1 text-[11px] text-forest-100/60">Lomé — Togo · {SITE_HOST}</p>
        </div>

        <div className="px-6 py-10 text-center sm:px-12">
          <h1 className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">Certificat de réussite</h1>
          <div className="mx-auto mt-3 h-0.5 w-28 bg-gold-400" aria-hidden="true" />

          <p className="mt-8 text-xs uppercase tracking-widest text-ink-400">Délivré avec fierté à</p>
          <p className="mt-2 font-display text-3xl font-semibold text-terra-600 sm:text-4xl">{cert.holderName}</p>

          <p className="mt-6 text-sm leading-relaxed text-ink-500">
            pour avoir suivi avec succès l&apos;intégralité de la formation
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-forest-900">« {cert.course.title} »</p>

          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-cream-300 bg-white p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Score final</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink-900">{cert.score} %</p>
            </div>
            <div className="rounded-xl border border-cream-300 bg-white p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Émis le</p>
              <p className="mt-1 font-display text-sm font-semibold leading-5 text-ink-900">{dateStr}</p>
            </div>
            <div className="rounded-xl border border-gold-400/60 bg-white p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">Code</p>
              <p className="mt-1 font-mono text-sm font-semibold text-forest-900">{cert.code}</p>
            </div>
          </div>

          <p className="mt-8 text-xs italic text-ink-400">K.A.S. Rodrigue — Fondateur & Directeur créatif, RodLab Studio</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`/api/formation/certificat/${cert.code}`}
          className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Télécharger le certificat PDF
        </a>
        <Link
          href="/formation"
          className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-6 py-3.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
        >
          <GraduationCap className="h-4 w-4" aria-hidden="true" /> Découvrir la formation
        </Link>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ink-400">
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Cette page est la preuve officielle d&apos;authenticité — partagez-la librement avec vos employeurs ou clients.
      </p>
    </div>
  );
}
