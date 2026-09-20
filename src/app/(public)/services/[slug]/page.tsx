import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { SERVICES } from "@/lib/site-data";
import { Palette, Code2, GraduationCap, Megaphone, Check, ArrowRight, ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";

const SERVICE_ICONS = { palette: Palette, code: Code2, graduation: GraduationCap, megaphone: Megaphone } as const;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service introuvable" };
  return {
    title: `${service.title} — ${service.subtitle}`,
    description: service.short,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== slug);
  const Icon = SERVICE_ICONS[service.icon as keyof typeof SERVICE_ICONS] ?? Palette;

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.subtitle}
        breadcrumbs={[{ href: "/services", label: "Services" }, { label: service.title }]}
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:bg-terra-700"
          >
            Demander un devis pour ce service
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-terra-600 shadow-card">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
      </PageHero>

      {/* ————— Présentation ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="presentation-title">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 id="presentation-title" className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Ce que nous faisons, concrètement
            </h2>
            {service.intro.map((para, i) => (
              <p key={i} className="mt-5 text-base leading-relaxed text-ink-500">{para}</p>
            ))}
          </div>
          <div>
            <div className="overflow-hidden rounded-3xl border border-cream-300 shadow-lift">
              <Image
                src={service.image}
                alt={`${service.title} — illustration de l'atelier RodLab Studio`}
                width={1280}
                height={733}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-64 w-full object-cover"
              />
            </div>
            <div className="mt-6 rounded-3xl border border-cream-300 bg-cream-100 p-8">
              <h3 className="font-display text-lg font-semibold text-ink-900">Prestations incluses</h3>
              <ul className="mt-5 grid gap-3">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-terra-100">
                      <Check className="h-3.5 w-3.5 text-terra-600" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ————— Bénéfices ————— */}
      <section className="border-y border-cream-300 bg-cream-50 py-16" aria-labelledby="benefices-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Pourquoi ça marche</p>
            <h2 id="benefices-title" className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Trois bénéfices concrets pour votre activité
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {service.benefits.map((b, i) => (
              <article key={b.title} className="rounded-3xl border border-cream-300 bg-card p-7 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-700 font-display text-base font-semibold text-cream-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Formules / tarifs ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="tarifs-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Formules</p>
          <h2 id="tarifs-title" className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Des tarifs clairs, adaptés à votre stade
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            Chaque projet reste unique : ces formules servent de base au devis détaillé
            que nous vous envoyons gratuitement sous 24 h.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {service.plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-card ${
                plan.popular
                  ? "border-terra-500 bg-ink-900 text-cream-100 shadow-lift lg:-translate-y-3"
                  : "border-cream-300 bg-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-terra-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-cream-50">
                  <Sparkles className="h-3 w-3" aria-hidden="true" /> Le plus choisi
                </span>
              )}
              <h3 className={`font-display text-xl font-semibold ${plan.popular ? "text-cream-50" : "text-ink-900"}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-xs ${plan.popular ? "text-cream-100/60" : "text-ink-400"}`}>{plan.desc}</p>
              <p className={`mt-5 font-display text-3xl font-semibold ${plan.popular ? "text-gold-400" : "text-terra-600"}`}>
                {plan.price}
              </p>
              <ul className="mt-6 grid flex-1 gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.popular ? "text-cream-100/85" : "text-ink-700"}`}>
                    <BadgeCheck className={`mt-0.5 h-4 w-4 shrink-0 ${plan.popular ? "text-gold-400" : "text-forest-600"}`} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?service=${service.slug}&plan=${encodeURIComponent(plan.name)}`}
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-terra-600 text-cream-50 hover:bg-terra-500"
                    : "border border-cream-400 bg-white text-ink-900 hover:bg-cream-100"
                }`}
              >
                Choisir cette formule
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ————— FAQ du service ————— */}
      <section className="border-y border-cream-300 bg-cream-50 py-16" aria-labelledby="faq-service-title">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="faq-service-title" className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Questions fréquentes — {service.title.toLowerCase()}
          </h2>
          <div className="mt-8 grid gap-4">
            {service.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-cream-300 bg-card px-6 py-5 shadow-card"
              >
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-ink-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-terra-600 transition group-open:rotate-45" aria-hidden="true">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-ink-500">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-500">
            D&apos;autres questions ?{" "}
            <Link href="/faq" className="font-semibold text-terra-600 hover:underline">
              Consultez la FAQ complète
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ————— Autres services ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="autres-title">
        <h2 id="autres-title" className="font-display text-2xl font-semibold text-ink-900">
          Découvrir nos autres services
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {others.map((s) => {
            const OtherIcon = SERVICE_ICONS[s.icon as keyof typeof SERVICE_ICONS] ?? Palette;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={`${s.title} — illustration`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 shadow-chip backdrop-blur">
                    <OtherIcon className="h-4.5 w-4.5 text-terra-600" aria-hidden="true" />
                  </span>
                </div>
                <span className="flex flex-1 flex-col p-5">
                  <span className="block font-display text-base font-semibold text-ink-900">{s.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-500">{s.short}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
