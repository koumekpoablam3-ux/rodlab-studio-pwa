import Link from "next/link";
import Image from "next/image";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { VALUES, TIMELINE, TEAM, STATS, TESTIMONIALS, AGENCY_PHOTOS } from "@/lib/site-data";
import { Eye, Award, Handshake, TrendingUp, Star, ArrowRight, MapPin } from "lucide-react";

export const metadata = {
  title: "À propos de l'agence",
  description:
    "L'histoire de RodLab Studio depuis 2018 à Lomé : nos valeurs, notre équipe et notre méthode pour accompagner les entreprises togolaises vers le numérique.",
};

const VALUE_ICONS = { eye: Eye, award: Award, handshake: Handshake, trending: TrendingUp } as const;

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="L'agence"
        title="Une équipe togolaise, des ambitions sans frontières."
        highlight="sans frontières."
        description="Depuis 2018, RodLab Studio accompagne les PME, institutions et entrepreneurs de Lomé et d'ailleurs dans leur transformation numérique. Voici qui nous sommes, d'où nous venons et ce qui nous anime."
        breadcrumbs={[{ label: "À propos" }]}
      />

      {/* ————— HISTOIRE / TIMELINE ————— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="histoire-title">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Notre histoire</p>
            <h2 id="histoire-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Deux ordinateurs, une obsession : la qualité
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-500">
              RodLab Studio est née d&apos;un constat simple : les entreprises togolaises
              méritaient le même niveau d&apos;exigence numérique que les grandes marques
              internationales — sans les tarifs et la distance des agences étrangères.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Huit ans plus tard, l&apos;agence a livré plus de 120 projets, formé plus de
              200 apprenants et s&apos;est dotée d&apos;un outil unique : l&apos;application
              RodLab, qui permet à chaque client de suivre ses projets, ses devis et ses
              factures depuis son téléphone, même hors-ligne.
            </p>
            {/* Diptyque photos du bureau */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl border border-cream-300 shadow-card">
                <Image
                  src={AGENCY_PHOTOS.bureau}
                  alt="Le lounge de l'agence RodLab Studio à Tokoin, Lomé"
                  width={640}
                  height={440}
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="h-36 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-cream-300 shadow-card">
                <Image
                  src={AGENCY_PHOTOS.equipe}
                  alt="Session de brainstorming de l'équipe devant le mur d'idées"
                  width={640}
                  height={440}
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="h-36 w-full object-cover"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-cream-300 bg-cream-100 p-5">
              <MapPin className="h-8 w-8 shrink-0 text-terra-600" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink-700">
                Notre bureau : <strong>Bd du Mono, Tokoin — Lomé</strong>. Passez nous voir,
                le café est offert et les idées fusent.
              </p>
            </div>
          </div>

          <ol className="relative space-y-6 border-l-2 border-cream-300 pl-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-terra-500 bg-cream-50 text-[10px] font-bold text-terra-600" aria-hidden="true">
                  ●
                </span>
                <p className="font-display text-2xl font-semibold text-terra-600">{t.year}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— VALEURS ————— */}
      <section className="border-y border-cream-300 bg-cream-50 py-20" aria-labelledby="valeurs-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Nos valeurs</p>
            <h2 id="valeurs-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Quatre principes, zéro compromis
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS] ?? Eye;
              return (
                <article key={v.title} className="rounded-3xl border border-cream-300 bg-card p-7 shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-forest-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{v.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ————— ÉQUIPE ————— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="equipe-title">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">L&apos;équipe</p>
          <h2 id="equipe-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Les visages derrière les projets
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Une équipe compacte et senior : chaque projet est porté par un référent
            unique qui le connaît dans les moindres détails.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="group overflow-hidden rounded-3xl border border-cream-300 bg-card text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.photo}
                  alt={`Portrait de ${member.name}, ${member.role}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/45 to-transparent" aria-hidden="true" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-terra-600">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ————— CHIFFRES + TÉMOIGNAGE ————— */}
      <section className="relative overflow-hidden border-y border-cream-300 py-16 text-cream-100" aria-label="Chiffres clés et témoignage">
        {/* Photo d'équipe en fond, voile forêt */}
        <Image
          src={AGENCY_PHOTOS.equipe}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/90" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-3xl border border-forest-700/60 bg-forest-800/70 p-6 backdrop-blur-sm">
                <p className="font-display text-4xl font-semibold text-gold-400">{s.value}</p>
                <p className="mt-1 text-sm text-forest-100/70">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center rounded-3xl border border-forest-700/60 bg-forest-800/70 p-8 backdrop-blur-sm">
            <div className="flex gap-1" aria-label="Note : 5 sur 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-cream-50">
              « {TESTIMONIALS[1].quote} »
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <Image
                src={TESTIMONIALS[1].photo}
                alt={`Portrait de ${TESTIMONIALS[1].name}`}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full border-2 border-forest-700 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gold-400">{TESTIMONIALS[1].name}</p>
                <p className="text-xs text-forest-100/60">{TESTIMONIALS[1].role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Envie de travailler avec nous ?"
        text="Racontez-nous votre projet : nous vous répondons sous 24 h ouvrées avec une première proposition concrète."
      />
    </>
  );
}
