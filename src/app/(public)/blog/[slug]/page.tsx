import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand } from "@/components/landing/page-hero";
import { BLOG_POSTS } from "@/lib/site-data-content";
import { CalendarDays, Clock3, ArrowRight, User, CheckCircle2 } from "lucide-react";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Article introuvable" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      {/* ————— En-tête d'article ————— */}
      <section className="woven-pattern border-b border-cream-300 bg-cream-50">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ href: "/blog", label: "Blog" }, { label: post.category }]} />
          <span className="mt-6 inline-block rounded-full bg-terra-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-terra-700">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-500">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-cream-300 pt-5 text-xs text-ink-400">
            <span className="flex items-center gap-2">
              <Image
                src={post.author.photo}
                alt={`Portrait de ${post.author.name}`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-cream-300 object-cover"
              />
              <span className="font-semibold text-ink-700">{post.author.name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {post.readTime} de lecture
            </span>
          </div>
        </div>
      </section>

      {/* ————— Image de couverture ————— */}
      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-cream-300 shadow-lift">
          <Image
            src={post.cover}
            alt={`Illustration de l'article : ${post.title}`}
            width={1280}
            height={733}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="h-60 w-full object-cover sm:h-80"
          />
        </div>
      </div>

      {/* ————— Corps de l'article ————— */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {post.content.map((section, i) => (
          <section key={i} className="mt-8 first:mt-0">
            <h2 className="font-display text-xl font-semibold text-ink-900 sm:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs.map((para, j) => (
              <p key={j} className="mt-4 text-base leading-[1.8] text-ink-700">
                {para}
              </p>
            ))}
          </section>
        ))}

        {/* Encart auteur */}
        <aside className="mt-12 flex items-start gap-4 rounded-3xl border border-cream-300 bg-cream-100 p-6">
          <Image
            src={post.author.photo}
            alt={`Portrait de ${post.author.name}`}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-chip"
          />
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">Écrit par</p>
            <p className="font-display text-base font-semibold text-ink-900">{post.author.name}</p>
            <p className="mt-0.5 text-sm text-ink-500">{post.author.role}</p>
          </div>
        </aside>
      </article>

      {/* ————— Autres articles ————— */}
      <section className="border-t border-cream-300 bg-cream-50 py-14" aria-labelledby="autres-articles">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="autres-articles" className="font-display text-2xl font-semibold text-ink-900">
            À lire également
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={`Illustration de l'article : ${p.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900 backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-terra-700">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terra-600">
                    Lire <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Prêt à passer à l'action ?"
        text="Les conseils, c'est notre métier. Demandez votre devis gratuit et voyez ce que RodLab Studio peut faire pour votre entreprise."
      />
    </>
  );
}
