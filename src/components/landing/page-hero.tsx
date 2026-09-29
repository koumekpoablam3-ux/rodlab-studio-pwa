import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { AGENCY_PHOTOS } from "@/lib/site-data";

/** Fil d'Ariane rendu côté serveur (sous-pages du site public). */
export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="no-print">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-400">
        <li>
          <Link href="/" className="transition hover:text-terra-600">Accueil</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="transition hover:text-terra-600">{item.label}</Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** En-tête standard de sous-page : fond crème, fil d'Ariane, titre, chapô. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  breadcrumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  const idx = highlight ? title.lastIndexOf(highlight) : -1;
  return (
    <section className="woven-pattern border-b border-cream-300 bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-terra-600">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
          {idx === -1 ? (
            title
          ) : (
            <>
              {title.slice(0, idx)}
              <span className="text-terra-600">{title.slice(idx)}</span>
            </>
          )}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Bande d'appel à l'action réutilisable en bas de page. */
export function CtaBand({
  title = "Un projet en tête ? Parlons-en.",
  text = "Décrivez-nous votre besoin en 2 minutes : nous revenons vers vous sous 24 h avec une première proposition.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 no-print">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest-900 px-6 py-12 text-center sm:px-12 lg:py-16">
        {/* Photo de Lomé en fond, voile forêt pour la lisibilité */}
        <Image
          src={AGENCY_PHOTOS.lome}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/55 to-forest-900/80"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold text-cream-50 sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-forest-100/90 sm:text-base">{text}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
            >
              Demander un devis gratuit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 rounded-full border border-cream-100/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-cream-50 backdrop-blur transition hover:bg-white/20"
            >
              Voir nos réalisations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
