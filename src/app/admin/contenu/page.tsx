import { db } from "@/lib/db";
import { SERVICES, TEAM, TESTIMONIALS, AGENCY_PHOTOS } from "@/lib/site-data";
import { REALISATIONS, BLOG_POSTS } from "@/lib/site-data-content";
import { DEFAULT_CAROUSEL, getOverrides } from "@/lib/site-overrides";
import { ContentEditor, type Group } from "./content-editor";

export const metadata = { title: "Contenu du site" };
export const dynamic = "force-dynamic";

export default async function AdminContenuPage() {
  const [contents, o] = await Promise.all([
    db.siteContent.findMany({ orderBy: [{ section: "asc" }, { key: "asc" }] }),
    getOverrides(),
  ]);

  // Valeur courante = surcharge enregistrée (non vide) sinon valeur par défaut du site.
  const f = (key: string, label: string, kind: "image" | "text" | "textarea", def: string) => ({
    key, label, kind, def, value: o[key]?.trim() ? o[key] : def,
  });

  const groups: Record<string, Group[]> = {
    agency: [
      {
        title: "Photos de l'agence",
        hint: "Ces photos apparaissent sur plusieurs pages du site.",
        fields: [
          f("agency.hero", "Photo principale de l'accueil (à droite du titre)", "image", AGENCY_PHOTOS.hero),
          f("agency.client", "Photo « Pourquoi nous choisir » (accueil)", "image", AGENCY_PHOTOS.client),
          f("agency.bureau", "Photo du bureau (page À propos)", "image", AGENCY_PHOTOS.bureau),
          f("agency.equipe", "Photo d'équipe (À propos : histoire + bandeau des chiffres)", "image", AGENCY_PHOTOS.equipe),
          f("agency.lome", "Vue de Lomé (bandeau « Un projet en tête ? » en bas des pages)", "image", AGENCY_PHOTOS.lome),
        ],
      },
    ],
    services: SERVICES.map((s) => ({
      title: s.title,
      fields: [f(`service.${s.slug}.image`, "Photo du service", "image", s.image)],
    })),
    realisations: REALISATIONS.map((r) => ({
      title: r.title,
      fields: [
        f(`real.${r.slug}.image`, "Photo du projet", "image", r.image),
        f(`real.${r.slug}.title`, "Titre", "text", r.title),
        f(`real.${r.slug}.summary`, "Résumé", "textarea", r.summary),
      ],
    })),
    blog: BLOG_POSTS.map((p) => ({
      title: p.title,
      fields: [
        f(`blog.${p.slug}.cover`, "Photo de couverture", "image", p.cover),
        f(`blog.${p.slug}.title`, "Titre de l'article", "text", p.title),
        f(`blog.${p.slug}.excerpt`, "Extrait", "textarea", p.excerpt),
      ],
    })),
    testimonials: TESTIMONIALS.map((t, i) => ({
      title: `${t.name} — ${t.role}`,
      fields: [
        f(`testimonial.${i}.photo`, "Portrait", "image", t.photo),
        f(`testimonial.${i}.name`, "Nom", "text", t.name),
        f(`testimonial.${i}.role`, "Fonction", "text", t.role),
        f(`testimonial.${i}.quote`, "Témoignage", "textarea", t.quote),
      ],
    })),
  };

  const carouselDefault = JSON.stringify(DEFAULT_CAROUSEL);
  const teamDefault = JSON.stringify(TEAM.map((m) => ({ name: m.name, role: m.role, bio: m.bio, photo: m.photo })));

  return (
    <div className="mx-auto max-w-5xl">
      <ContentEditor
        initialContents={contents}
        groups={groups}
        carousel={{ key: "carousel.slides", def: carouselDefault, value: o["carousel.slides"]?.trim() ? o["carousel.slides"] : carouselDefault }}
        team={{ key: "team.members", def: teamDefault, value: o["team.members"]?.trim() ? o["team.members"] : teamDefault }}
      />
    </div>
  );
}
