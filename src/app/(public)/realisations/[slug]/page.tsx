import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { REALISATIONS } from "@/lib/site-data-content";
import { Check, Quote, ArrowRight, CalendarDays, Clock3, User } from "lucide-react";

export function generateStaticParams() {
  return REALISATIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = REALISATIONS.find((r) => r.slug === slug);
  if (!item) return { title: "Réalisation introuvable" };
  return { title: `${item.title} — Étude de cas`, description: item.summary };
}

const ACCENT_BG = { terra: "bg-terra-600", forest: "bg-forest-700", gold: "bg-gold-500" } as const;

export default async function RealisationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = REALISATIONS.find((r) => r.slug === slug);
  if (!item) notFound();

  const similar = REALISATIONS.filter((r) => r.slug !== slug && r.category === item.category)
    .concat(REALISATIONS.filter((r) => r.slug !== slug && r.category !== item.category))
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`Étude de cas — ${item.categoryLabel}`}
        title={item.title}
        description={item.summary}
        breadcrumbs={[{ href: "/realisations", label: "Réalisations" }, { label: item.title }]}
      >
        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-white px-5 py-4">
            <User className="h-5 w-5 shrink-0 text-terra-600" aria-hidden="true" />
            <span className="font-medium text-ink-900">{item.client}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-white px-5 py-4">
            <CalendarDays className="h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
            <span className="font-medium text-ink-900">Livré en {item.year}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-white px-5 py-4">
            <Clock3 className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
            <span className="font-medium text-ink-900">Durée : {item.duration}</span>
          </div>
        </div>
      </PageHero>

      {/* ————— Image du projet ————— */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8" aria-label="Aperçu du projet">
        <div className="relative overflow-hidden rounded-[2rem] border border-cream-300 shadow-lift">
          <Image
            src={item.image}
            alt={`${item.title} — aperçu du projet réalisé par RodLab Studio`}
            width={1280}
            height={733}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="h-72 w-full object-cover sm:h-96"
          />
          <span className="absolute bottom-4 left-5 rounded-full bg-ink-900/70 px-4 py-1.5 text-xs font-semibold text-cream-50 backdrop-blur">
            {item.client}
          </span>
        </div>
      </section>

      {/* ————— Résultats clés ————— */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-label="Résultats clés">
        <div className="grid gap-6 sm:grid-cols-3">
          {item.results.map((res) => (
            <div key={res.label} className={`rounded-3xl ${ACCENT_BG[item.accent]} p-8 text-center text-white shadow-card`}>
              <p className="font-display text-4xl font-semibold">{res.value}</p>
              <p className="mt-2 text-sm text-white/85">{res.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————— Défi / Solution ————— */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8" aria-labelledby="defi-title">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-cream-300 bg-card p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Le défi</p>
            <h2 id="defi-title" className="mt-3 font-display text-xl font-semibold text-ink-900">
              Le point de départ
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">{item.challenge}</p>
          </article>
          <article className="rounded-3xl border border-cream-300 bg-card p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest-600">Notre solution</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink-900">Ce que nous avons construit</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">{item.solution}</p>
          </article>
        </div>

        {/* Fonctionnalités livrées */}
        <div className="mt-8 rounded-3xl border border-cream-300 bg-cream-100 p-8">
          <h3 className="font-display text-lg font-semibold text-ink-900">Fonctionnalités livrées</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {item.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-forest-100">
                  <Check className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-cream-400 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Témoignage client ————— */}
      <section className="border-y border-cream-300 bg-forest-900 py-16 text-cream-100" aria-label="Témoignage du client">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Quote className="mx-auto h-10 w-10 text-gold-400" aria-hidden="true" />
          <blockquote className="mt-6 font-display text-xl leading-relaxed text-cream-50 sm:text-2xl">
            « {item.testimonial.quote} »
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-gold-400">{item.testimonial.name}</p>
          <p className="text-xs text-forest-100/60">{item.testimonial.role}</p>
        </div>
      </section>

      {/* ————— Projets similaires ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="similaires-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="similaires-title" className="font-display text-2xl font-semibold text-ink-900">
            À découvrir aussi
          </h2>
          <Link href="/realisations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terra-600 hover:underline">
            Tout le portfolio <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {similar.map((r) => (
            <Link
              key={r.slug}
              href={`/realisations/${r.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={r.image}
                  alt={`${r.title} — ${r.categoryLabel}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900">
                  {r.categoryLabel}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900 group-hover:text-terra-700">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{r.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        title="Un projet similaire en tête ?"
        text="Nous avons probablement déjà résolu un problème comme le vôtre. Parlons-en : premier échange gratuit, sans engagement."
      />
    </>
  );
}
