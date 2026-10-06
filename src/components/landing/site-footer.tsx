import Link from "next/link";
import { Logo } from "@/components/brand";
import { NAV, SERVICES, STATS } from "@/lib/site-data";
import { Facebook, Instagram, Phone, Mail, MapPin, Clock, ArrowRight, Download } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest-900 text-forest-100 no-print">
      {/* Bandeau chiffres */}
      <div className="border-b border-forest-800">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <p className="font-display text-3xl font-semibold text-gold-400">{s.value}</p>
              <p className="mt-1 text-xs text-forest-100/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Colonnes principales */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Logo light size="sm" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-100/70">
            Agence de design graphique, développement numérique et formation
            professionnelle basée à Lomé, Togo. Depuis 2018.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://facebook.com/rodlabstudio" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-xl border border-forest-700 transition hover:bg-forest-800">
              <Facebook className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
            <a href="https://instagram.com/rodlabstudio" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl border border-forest-700 transition hover:bg-forest-800">
              <Instagram className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
            <a href="https://wa.me/22870088668" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-xl border border-forest-700 transition hover:bg-forest-800">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <Link
            href="/telecharger"
            className="group mt-5 flex items-center gap-3 rounded-2xl border border-forest-700 bg-forest-800/60 p-4 transition hover:bg-forest-800"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-forest-900">
              <Download className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-cream-50">Télécharger l&apos;application</span>
              <span className="block text-xs text-forest-100/70">
                PWA gratuite — Android, iPhone & ordinateur
              </span>
            </span>
          </Link>
        </div>

        <nav aria-label="Pied de page — agence">
          <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">Agence</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-forest-100/70">
            {NAV.footer.agence.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-cream-50">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Pied de page — services">
          <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">Services</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-forest-100/70">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition hover:text-cream-50">{s.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="font-medium text-gold-400 transition hover:text-gold-300">
                Voir les tarifs →
              </Link>
            </li>
            <li className="pt-2">
              <Link href="/formation" className="font-medium text-gold-400 transition hover:text-gold-300">
                Formation en ligne certifiante →
              </Link>
            </li>
            <li>
              <Link href="/live" className="font-medium text-gold-400 transition hover:text-gold-300">
                Sessions live à distance →
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">Contact</p>
          <ul className="mt-4 grid gap-3 text-sm text-forest-100/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              Bd du Mono, Tokoin — Lomé, Togo
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <a href="tel:+22870088668" className="hover:text-cream-50">+228 70 08 86 68</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <a href="mailto:contact@rodlabstudio.tg" className="hover:text-cream-50">contact@rodlabstudio.tg</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              Lun – Ven 8 h – 18 h · Sam 9 h – 13 h
            </li>
          </ul>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-terra-600 px-5 py-2.5 text-xs font-bold text-cream-50 transition hover:bg-terra-500"
          >
            Demander un devis gratuit <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-t border-forest-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-forest-100/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} RodLab Studio — Lomé, Togo. Tous droits réservés.</p>
          <p className="font-medium tracking-wide">« Imaginer. Concevoir. Développer. »</p>
        </div>
      </div>
    </footer>
  );
}
