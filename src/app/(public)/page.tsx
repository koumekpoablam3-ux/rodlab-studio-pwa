import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Palette, Code2, GraduationCap, Megaphone, Check, ArrowRight, Star,
  Smartphone, WifiOff, BellRing, ArrowUpRight, CalendarDays, Clock3,
} from "lucide-react";
import { SERVICES, PROCESS_STEPS, TESTIMONIALS, WHY_US, STATS, AGENCY_PHOTOS } from "@/lib/site-data";
import { REALISATIONS, BLOG_POSTS } from "@/lib/site-data-content";
import { CtaBand } from "@/components/landing/page-hero";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { InstallButton } from "@/components/pwa/install-prompt";
import { DownloadQrCard } from "@/components/landing/download-app";
import { SplashScreen } from "@/components/splash-screen";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";

export const metadata = {
  title: "RodLab Studio — Votre vision, notre expertise",
  description:
    "Agence de design graphique, développement numérique et formation professionnelle à Lomé, Togo. Sites, e-commerce, identités visuelles et PWA installables.",
};

async function getContentMap() {
  const rows = await db.siteContent.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

const SERVICE_ICONS = { palette: Palette, code: Code2, graduation: GraduationCap, megaphone: Megaphone } as const;
const ACCENTS = {
  terra: { chip: "bg-terra-100 text-terra-600", link: "text-terra-600" },
  forest: { chip: "bg-forest-100 text-forest-600", link: "text-forest-600" },
  gold: { chip: "bg-gold-100 text-gold-600", link: "text-gold-600" },
} as const;

const FEATURED = ["kafo-market", "hotel-palm-beach", "togo-deliveries"];

export default async function HomePage() {
  const [content, session] = await Promise.all([getContentMap(), getServerSession(authOptions)]);
  const user = session?.user;
  const featured = FEATURED.map((slug) => REALISATIONS.find((r) => r.slug === slug)!).filter(Boolean);
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <>
      <SplashScreen />
      <LocalBusinessJsonLd />
      {/* ————— HERO (fond : carrousel auto-défilant des visuels RodLab) ————— */}
      <section className="relative overflow-hidden bg-hero-glow" aria-labelledby="hero-title">
        <HeroCarousel />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-terra-200 bg-terra-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terra-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-terra-500" aria-hidden="true" />
              Agence créative — Lomé, Togo
            </p>
            <h1 id="hero-title" className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-ink-900 sm:text-5xl lg:text-6xl">
              {(() => {
                const title = content["hero.title"] ?? "Votre vision, notre expertise.";
                const marker = "notre expertise";
                const idx = title.lastIndexOf(marker);
                if (idx === -1) return title;
                return (
                  <>
                    {title.slice(0, idx)}
                    <span className="text-terra-gold">{title.slice(idx)}</span>
                  </>
                );
              })()}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
              {content["hero.subtitle"] ??
                "Agence de design graphique, développement numérique et formation professionnelle à Lomé. Nous transformons vos idées en expériences digitales mémorables."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700"
              >
                Demander un devis gratuit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/realisations"
                className="inline-flex items-center gap-2 rounded-full border border-cream-400 bg-white/70 px-7 py-3.5 text-sm font-semibold text-ink-900 transition hover:bg-white"
              >
                Découvrir nos réalisations
              </Link>
            </div>

            {/* Badges PWA */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-ink-500">
              <Link
                href="/telecharger"
                className="flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-50 px-3.5 py-1.5 font-semibold text-forest-700 transition hover:bg-forest-100"
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                Application installable
              </Link>
              <span className="flex items-center gap-1.5">
                <WifiOff className="h-4 w-4 text-forest-600" aria-hidden="true" />
                Consultation hors-ligne
              </span>
              <span className="flex items-center gap-1.5">
                <BellRing className="h-4 w-4 text-forest-600" aria-hidden="true" />
                Notifications en temps réel
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px] sm:max-w-sm lg:max-w-none">
            {/* Visuel officiel RodLab (session de formation) + cartes flottantes */}
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-cream-300 shadow-lift">
                <Image
                  src={AGENCY_PHOTOS.hero}
                  alt="Session de formation RodLab Studio — Nous formons les talents de demain"
                  width={1024}
                  height={1536}
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Carte avancement — flottante en bas à gauche */}
              <div className="absolute -bottom-6 -left-3 w-64 rounded-2xl border border-cream-300 bg-white/95 p-4 shadow-lift backdrop-blur sm:-left-8">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Projet en cours</p>
                  <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-[10px] font-bold text-forest-700">65 %</span>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cream-200">
                  <div className="h-full w-[65%] rounded-full bg-terra-gold" />
                </div>
                <p className="mt-2.5 flex items-center justify-between text-[11px] text-ink-400">
                  <span className="font-medium text-ink-700">Site web & réservation</span>
                  <span>Hôtel Palma</span>
                </p>
              </div>

              {/* Pastille notification — flottante en haut à droite */}
              <div className="absolute -right-2 -top-5 flex items-center gap-2.5 rounded-2xl border border-cream-300 bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:-right-6">
                <Image src="/icons/icon-192.png" alt="" width={34} height={34} className="rounded-xl" />
                <div>
                  <p className="text-xs font-semibold text-ink-900">Nouveau devis reçu</p>
                  <p className="text-[10px] text-ink-400">DV-2026-004 · il y a 2 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— STATS ————— */}
      <section className="woven-pattern border-y border-cream-300 bg-cream-50" aria-label="Chiffres clés">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-terra-600">{s.value}</p>
              <p className="mt-1 text-sm text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————— SERVICES (aperçu) ————— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="services-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Nos services</p>
            <h2 id="services-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Quatre expertises, un seul interlocuteur
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              De la première esquisse au lancement, nous couvrons l&apos;ensemble de votre
              présence digitale avec des équipes dédiées et des délais maîtrisés.
            </p>
          </div>
          <Link href="/services" className="inline-flex items-center gap-1.5 rounded-full border border-cream-400 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-cream-100">
            Tous les services & tarifs
            <ArrowUpRight className="h-4 w-4 text-terra-600" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.icon as keyof typeof SERVICE_ICONS] ?? Palette;
            const accent = ACCENTS[service.accent];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} — illustration`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-chip backdrop-blur">
                    <Icon className="h-5.5 w-5.5 text-terra-600" aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-4 right-5 rounded-full bg-ink-900/70 px-3.5 py-1 text-[11px] font-semibold text-cream-50 backdrop-blur">
                    {service.subtitle}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold text-ink-900">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{service.description}</p>
                  <ul className="mt-5 grid flex-1 gap-2 sm:grid-cols-2">
                    {service.items.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-ink-700">
                        <Check className={`h-4 w-4 shrink-0 ${accent.link}`} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ————— RÉALISATIONS (aperçu) ————— */}
      <section className="border-y border-cream-300 bg-cream-50 py-20" aria-labelledby="realisations-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Réalisations</p>
              <h2 id="realisations-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                Des projets qui parlent d&apos;eux-mêmes
              </h2>
            </div>
            <Link href="/realisations" className="inline-flex items-center gap-1.5 rounded-full border border-cream-400 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-cream-100">
              Voir le portfolio complet
              <ArrowUpRight className="h-4 w-4 text-terra-600" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((r) => (
              <Link
                key={r.slug}
                href={`/realisations/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={r.image}
                    alt={`${r.title} — ${r.categoryLabel}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" aria-hidden="true" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900">
                    {r.categoryLabel}
                  </span>
                  <h3 className="absolute bottom-4 left-5 font-display text-xl font-semibold text-white">
                    {r.title}
                  </h3>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-relaxed text-ink-500">{r.summary}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-cream-200 pt-4">
                    {r.results.slice(0, 3).map((res) => (
                      <div key={res.label}>
                        <p className="font-display text-base font-semibold text-terra-600">{res.value}</p>
                        <p className="mt-0.5 text-[11px] leading-tight text-ink-400">{res.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ————— MÉTHODE ————— */}
      <section className="border-y border-cream-300 bg-forest-900 py-20 text-cream-100" aria-labelledby="methode-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Notre méthode</p>
            <h2 id="methode-title" className="mt-3 font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              Un processus clair, de l&apos;idée à la mise en ligne
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <li key={step.step} className="rounded-3xl border border-forest-700 bg-forest-800/60 p-6">
                <p className="font-display text-3xl font-semibold text-gold-400">{step.step}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-cream-50">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-100/75">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— POURQUOI NOUS ————— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="why-title">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Pourquoi RodLab</p>
            <h2 id="why-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              La rigueur d&apos;une agence, la proximité d&apos;un partenaire
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Nous ne livrons pas des fichiers : nous construisons des outils qui font
              grandir votre activité. Chaque projet démarre par l&apos;écoute et se termine
              par une formation complète de vos équipes.
            </p>
            <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-cream-300 shadow-lift">
              <Image
                src={AGENCY_PHOTOS.client}
                alt="Un chargé de projet RodLab serre la main d'un client satisfait"
                width={1280}
                height={733}
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="h-56 w-full object-cover sm:h-64"
              />
            </div>
            <Link
              href="/a-propos"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:bg-forest-800"
            >
              Découvrir l&apos;agence
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4">
            {WHY_US.map((item, i) => (
              <div key={item.title} className="flex gap-4 rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terra-100 font-display text-base font-semibold text-terra-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— AVIS ————— */}
      <section className="woven-pattern border-y border-cream-300 bg-cream-50 py-20" aria-labelledby="avis-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Ils nous font confiance</p>
            <h2 id="avis-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Des clients qui recommandent
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-3xl border border-cream-300 bg-card p-7 shadow-card">
                <div className="flex gap-1" aria-label="Note : 5 sur 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-cream-200 pt-4">
                  <Image
                    src={t.photo}
                    alt={`Portrait de ${t.name}`}
                    width={48}
                    height={48}
                    className="h-11 w-11 rounded-full border-2 border-cream-200 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                    <p className="text-xs text-ink-500">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ————— BLOG (aperçu) ————— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="blog-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Blog & actualités</p>
            <h2 id="blog-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Nos conseils pour réussir en ligne
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 rounded-full border border-cream-400 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-cream-100">
            Tous les articles
            <ArrowUpRight className="h-4 w-4 text-terra-600" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={post.cover}
                  alt={`Illustration — ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900 backdrop-blur">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-terra-700">
                  {post.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
                <div className="mt-5 flex items-center gap-4 border-t border-cream-200 pt-4 text-xs text-ink-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ————— APPLICATION (PWA) ————— */}
      <section className="border-y border-cream-300 bg-forest-900 py-20 text-cream-100" aria-labelledby="app-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">L&apos;application RodLab</p>
            <h2 id="app-title" className="mt-3 font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              Vos projets dans la poche, même sans réseau
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-forest-100/80">
              Installez RodLab Studio comme une vraie application — sans store, sans
              téléchargement lourd. Suivez vos chantiers, validez vos devis et
              discutez avec l&apos;équipe depuis votre écran d&apos;accueil.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-forest-100/85">
              {[
                "Ouverture en un geste depuis l'écran d'accueil",
                "Projets, devis et factures consultables hors-ligne",
                "Notifications push à chaque nouvelle activité",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <InstallButton size="lg" variant="light" label="Installer l'application" />
              <Link
                href="/telecharger"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 transition hover:text-gold-300"
              >
                Page de téléchargement
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
            <div className="w-[150px] shrink-0 -rotate-3 sm:w-[170px]">
              <div className="rounded-[1.75rem] border-[5px] border-ink-900 bg-cream-50 shadow-lift">
                <div className="overflow-hidden rounded-[1.4rem]">
                  <Image
                    src="/screenshots/app-client-accueil.png"
                    alt="Aperçu de l'application RodLab Studio sur téléphone"
                    width={390}
                    height={844}
                    sizes="170px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
            <div className="w-[190px] shrink-0 sm:w-[210px]">
              <div className="rounded-3xl bg-cream-50 p-4 text-center shadow-lift">
                <DownloadQrCard compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— CTA FINALE ————— */}
      <CtaBand
        title={content["cta.title"] ?? "Un projet en tête ? Parlons-en."}
        text={content["cta.text"] ?? "Décrivez-nous votre besoin en 2 minutes : nous revenons vers vous sous 24 h avec une première proposition."}
      />
    </>
  );
}
