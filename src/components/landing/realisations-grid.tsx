"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { REALISATIONS, CASE_CATEGORIES, type CaseCategory } from "@/lib/site-data-content";

const YEAR_BG = { terra: "bg-terra-600", forest: "bg-forest-700", gold: "bg-gold-500" } as const;

export function RealisationsGrid() {
  const [filter, setFilter] = useState<CaseCategory | "tous">("tous");
  const visible = REALISATIONS.filter((r) => filter === "tous" || r.category === filter);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-label="Portfolio des réalisations">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
        {CASE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            aria-pressed={filter === c.value}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              filter === c.value
                ? "bg-ink-900 text-cream-50 shadow-chip"
                : "border border-cream-400 bg-white text-ink-700 hover:bg-cream-100"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => (
          <Link
            key={r.slug}
            href={`/realisations/${r.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={r.image}
                alt={`${r.title} — ${r.categoryLabel}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900">
                  {r.categoryLabel}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${YEAR_BG[r.accent]}`}>
                  {r.year}
                </span>
              </div>
              <h2 className="absolute bottom-4 left-5 font-display text-2xl font-semibold text-white">
                {r.title}
              </h2>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{r.client}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{r.summary}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-cream-200 pt-4">
                {r.results.map((res) => (
                  <div key={res.label}>
                    <p className="font-display text-lg font-semibold text-terra-600">{res.value}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-ink-400">{res.label}</p>
                  </div>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terra-600">
                Lire l&apos;étude de cas
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-16 text-center text-sm text-ink-400">Aucun projet dans cette catégorie pour le moment.</p>
      )}
    </section>
  );
}
