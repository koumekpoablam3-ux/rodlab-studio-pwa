import { db } from "@/lib/db";
import { requirePermission } from "@/lib/access";
import { ensureRealisationsSeeded, parseList } from "@/lib/realisations";
import { REALISATIONS as DEFAULTS } from "@/lib/site-data-content";
import type { RealisationForm } from "@/lib/realisation-types";
import { RealisationsBoard } from "./realisations-board";

export const metadata = { title: "Réalisations" };
export const dynamic = "force-dynamic";

export default async function AdminRealisationsPage() {
  await requirePermission("content");
  // Première visite : les 6 exemples d'origine sont importés en base pour pouvoir être modifiés ou supprimés.
  await ensureRealisationsSeeded().catch(() => {});

  const rows = await db.realisation.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] });
  const items: (RealisationForm & { id: string; slug: string })[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: (["web", "ecommerce", "branding", "mobile"].includes(r.category) ? r.category : "web") as RealisationForm["category"],
    client: r.client,
    year: r.year,
    duration: r.duration,
    summary: r.summary,
    challenge: r.challenge,
    solution: r.solution,
    image: r.image,
    gallery: parseList<string>(r.gallery),
    liveUrl: r.liveUrl ?? "",
    results: parseList<{ value: string; label: string }>(r.results),
    features: parseList<string>(r.features),
    tags: parseList<string>(r.tags),
    testimonialQuote: r.testimonialQuote,
    testimonialName: r.testimonialName,
    testimonialRole: r.testimonialRole,
    accent: (["terra", "forest", "gold"].includes(r.accent) ? r.accent : "terra") as RealisationForm["accent"],
    published: r.published,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <RealisationsBoard items={items} exampleSlugs={DEFAULTS.map((d) => d.slug)} />
    </div>
  );
}
