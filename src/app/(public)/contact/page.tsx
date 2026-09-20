import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { ContactForm } from "@/components/landing/contact-form";
import { Phone, Mail, MapPin, Clock, Smartphone, WifiOff, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact & devis gratuit",
  description:
    "Demandez votre devis gratuit : formulaire en ligne, téléphone +228 70 08 86 68, email contact@rodlabstudio.tg ou visite au bureau Bd du Mono, Tokoin — Lomé.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; plan?: string }>;
}) {
  const { service } = await searchParams;

  const channels = [
    {
      icon: Phone,
      title: "Téléphone & WhatsApp",
      lines: ["+228 70 08 86 68", "Réponse immédiate aux heures ouvrées"],
      href: "tel:+22870088668",
      chip: "bg-terra-100 text-terra-600",
    },
    {
      icon: Mail,
      title: "Email",
      lines: ["contact@rodlabstudio.tg", "Réponse sous 24 h ouvrées"],
      href: "mailto:contact@rodlabstudio.tg",
      chip: "bg-forest-100 text-forest-600",
    },
    {
      icon: MapPin,
      title: "Bureau",
      lines: ["Bd du Mono, Tokoin — Lomé, Togo", "Visites sur rendez-vous"],
      chip: "bg-gold-100 text-gold-600",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet."
        highlight="votre projet."
        description="Devis gratuit et sans engagement. Décrivez votre besoin en 2 minutes : nous revenons vers vous sous 24 h ouvrées avec une première proposition détaillée."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="contact-form-title">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ————— Coordonnées ————— */}
          <div>
            <h2 className="sr-only" id="contact-form-title">Nous contacter</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Tous les canaux</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-ink-900">
              Choisissez le moyen qui vous arrange
            </h3>

            <ul className="mt-8 grid gap-4">
              {channels.map((c) => (
                <li key={c.title} className="flex items-start gap-4 rounded-3xl border border-cream-300 bg-card p-5 shadow-card">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${c.chip}`}>
                    <c.icon className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-ink-900">{c.title}</p>
                    {c.href ? (
                      <a href={c.href} className="mt-0.5 block text-sm font-medium text-terra-600 hover:underline">
                        {c.lines[0]}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-medium text-ink-900">{c.lines[0]}</p>
                    )}
                    <p className="text-xs text-ink-400">{c.lines[1]}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-4 rounded-3xl border border-cream-300 bg-cream-100 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-cream-50">
                <Clock className="h-5.5 w-5.5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-ink-900">Horaires d&apos;ouverture</p>
                <p className="mt-0.5 text-sm text-ink-500">Lundi – Vendredi : 8 h – 18 h</p>
                <p className="text-sm text-ink-500">Samedi : 9 h – 13 h · Dimanche : fermé</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-forest-900 p-6 text-cream-100">
              <p className="font-display text-lg font-semibold text-cream-50">L&apos;application RodLab</p>
              <p className="mt-2 text-sm leading-relaxed text-forest-100/75">
                Installez notre PWA depuis votre navigateur : suivez vos projets, devis et
                messages en temps réel, même sans connexion Internet.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-forest-100/70">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" /> Installable en 1 clic
                </span>
                <span className="flex items-center gap-1.5">
                  <WifiOff className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" /> Mode hors-ligne
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" /> Notifications push
                </span>
              </div>
            </div>
          </div>

          {/* ————— Formulaire ————— */}
          <div id="formulaire">
            <ContactForm defaultService={service} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Vous préférez être appelé ?"
        text="Laissez simplement votre numéro dans le formulaire avec la mention « rappel » : un membre de l'équipe vous appelle sous 24 h ouvrées."
      />
    </>
  );
}
