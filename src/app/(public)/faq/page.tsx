import Link from "next/link";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { FAQ_ITEMS } from "@/lib/site-data";
import { ArrowRight, Phone, HelpCircle } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "Questions fréquentes",
  description:
    "Délais, paiements Mobile Money, maintenance, propriété du code : toutes les réponses aux questions que nos clients se posent avant de lancer leur projet.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Toutes vos questions, des réponses directes."
        highlight="des réponses directes."
        description="Nous répondons ici aux questions que l'on nous pose le plus souvent. La vôtre n'y figure pas ? Écrivez-nous, la réponse arrive sous 24 h ouvrées."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="faq-title">
        <h2 id="faq-title" className="sr-only">Liste des questions fréquentes</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-2xl border border-cream-300 bg-card px-6 shadow-card data-[state=open]:border-terra-200"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold text-ink-900 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-relaxed text-ink-500">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 grid gap-6 rounded-3xl border border-cream-300 bg-cream-100 p-8 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terra-100 text-terra-600">
            <HelpCircle className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink-900">Vous ne trouvez pas votre réponse ?</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">
              Notre équipe répond à toutes les questions — même les plus techniques — sous 24 h ouvrées.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href="tel:+22870088668"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-400 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-cream-200"
            >
              <Phone className="h-4 w-4 text-forest-600" aria-hidden="true" /> Nous appeler
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700"
            >
              Poser ma question <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
