import Link from "next/link";
import Image from "next/image";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { SERVICES, PROCESS_STEPS } from "@/lib/site-data";
import { Palette, Code2, GraduationCap, Megaphone, Check, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Nos services & tarifs",
  description:
    "Design graphique, développement web et mobile, formation professionnelle, community management : découvrez nos quatre expertises et nos formules transparentes en FCFA.",
};

const SERVICE_ICONS = { palette: Palette, code: Code2, graduation: GraduationCap, megaphone: Megaphone } as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Quatre expertises, des formules transparentes."
        highlight="des formules transparentes."
        description="Pas de devis opaque ni de frais cachés : chaque service est découpé en formules claires, avec un prix de départ en FCFA. Le devis détaillé reste gratuit et sans engagement."
        breadcrumbs={[{ label: "Services" }]}
      />

      {/* ————— Liste des services ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Liste des services">
        <div className="grid gap-8 lg:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.icon as keyof typeof SERVICE_ICONS] ?? Palette;
            return (
              <article
                key={service.slug}
                className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} — illustration`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/5 to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-chip backdrop-blur">
                      <Icon className="h-5.5 w-5.5 text-terra-600" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                        Service {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="font-display text-xl font-semibold text-white drop-shadow-sm">{service.title}</h2>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-sm font-medium text-terra-600">{service.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{service.description}</p>
                  <ul className="mt-6 grid flex-1 gap-2.5">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-ink-700">
                        <Check className="h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-5">
                  <p className="text-xs text-ink-400">
                    À partir de{" "}
                    <span className="font-display text-base font-semibold text-terra-600">
                      {service.plans.find((p) => p.popular)?.price ?? service.plans[0].price}
                    </span>
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700"
                  >
                    Détails & formules
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ————— Méthode commune ————— */}
      <section className="border-y border-cream-300 bg-forest-900 py-20 text-cream-100" aria-labelledby="methode-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Méthode commune</p>
            <h2 id="methode-title" className="mt-3 font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              Le même soin appliqué à chaque mission
            </h2>
            <p className="mt-4 text-base leading-relaxed text-forest-100/75">
              Quel que soit le service, votre projet suit les mêmes quatre étapes — avec un
              avancement visible en temps réel dans votre espace client.
            </p>
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

      <CtaBand
        title="Besoin d'une combinaison de services ?"
        text="Identité + site + formation + community management : les projets complets bénéficient de tarifs groupés. Demandez votre devis groupé gratuit."
      />
    </>
  );
}
