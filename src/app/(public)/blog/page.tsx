import Link from "next/link";
import Image from "next/image";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { BLOG_POSTS } from "@/lib/site-data-content";
import { CalendarDays, Clock3, ArrowRight, User } from "lucide-react";

export const metadata = {
  title: "Blog & actualités",
  description:
    "Conseils web, Mobile Money, PWA, stratégie digitale : les articles pratiques de l'équipe RodLab Studio pour réussir votre présence en ligne au Togo.",
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Conseils pratiques, sans jargon."
        highlight="sans jargon."
        description="Nos articles répondent aux vraies questions des entrepreneurs togolais : prix, délais, Mobile Money, applications hors-ligne. Écrits par l'équipe qui fait le travail chaque jour."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-label="Liste des articles">
        {/* Article à la une */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid gap-8 rounded-3xl border border-cream-300 bg-card p-8 shadow-card transition hover:-translate-y-1 hover:shadow-lift lg:grid-cols-[1.2fr_0.8fr] lg:p-10"
        >
          <div>
            <span className="rounded-full bg-terra-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-terra-700">
              À la une · {featured.category}
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink-900 group-hover:text-terra-700 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">{featured.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" aria-hidden="true" /> {featured.author.name}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {featured.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {featured.readTime} de lecture
              </span>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-terra-600">
              Lire l&apos;article
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
          <div className="relative min-h-56 overflow-hidden rounded-2xl">
            <Image
              src={featured.cover}
              alt={`Illustration de l'article : ${featured.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 right-4 rounded-2xl bg-ink-900/70 px-4 py-2 font-display text-lg font-semibold text-gold-400 backdrop-blur">
              {featured.readTime}
            </span>
          </div>
        </Link>

        {/* Autres articles */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <Link href={`/blog/${post.slug}`} className="relative block h-44 overflow-hidden">
                <Image
                  src={post.cover}
                  alt={`Illustration de l'article : ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900 backdrop-blur">
                  {post.category}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-display text-lg font-semibold leading-snug text-ink-900">
                  <Link href={`/blog/${post.slug}`} className="transition hover:text-terra-700">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-4 text-xs text-ink-400">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" aria-hidden="true" /> {post.author.name.split(" ")[0]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terra-600 hover:underline"
                >
                  Lire l&apos;article <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Un article vous a convaincu ?"
        text="Passez de la lecture à l'action : décrivez votre projet et recevez une proposition concrète sous 24 h ouvrées."
      />
    </>
  );
}
