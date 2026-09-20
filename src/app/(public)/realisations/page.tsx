import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { RealisationsGrid } from "@/components/landing/realisations-grid";

export const metadata = {
  title: "Nos réalisations",
  description:
    "E-commerce avec paiement Mobile Money, sites de réservation, applications PWA hors-ligne, identités visuelles : explorez les études de cas de RodLab Studio à Lomé.",
};

export default function RealisationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Des projets réels, des résultats mesurables."
        highlight="des résultats mesurables."
        description="Chaque étude de cas présente le contexte, notre solution et les résultats obtenus. Pas de maquettes imaginaires : uniquement des projets livrés à des clients qui témoignent."
        breadcrumbs={[{ label: "Réalisations" }]}
      />
      <RealisationsGrid />
      <CtaBand
        title="Votre projet mérite sa propre étude de cas."
        text="Rejoignez les entreprises qui font confiance à RodLab Studio. Premier échange gratuit, proposition sous 24 h."
      />
    </>
  );
}
