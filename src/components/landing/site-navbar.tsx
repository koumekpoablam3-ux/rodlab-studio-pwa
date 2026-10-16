"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ArrowRight, ChevronDown, Palette, Code2, GraduationCap,
  Megaphone, Info, Newspaper, HelpCircle, Mail, FileText, LayoutDashboard,
  Download,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { NAV, SERVICES } from "@/lib/site-data";
import { useSession } from "next-auth/react";

const SERVICE_ICONS = { palette: Palette, code: Code2, graduation: GraduationCap, megaphone: Megaphone } as const;
const AGENCE_ICONS = { "/a-propos": Info, "/blog": Newspaper, "/faq": HelpCircle, "/contact": Mail } as const;

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [openMega, setOpenMega] = useState<"services" | "agence" | null>(null);
  const [mobileSection, setMobileSection] = useState<"services" | "agence" | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  // ── Anti-fermeture anticipée des mega-menus ────────────────────────────────
  // Au lieu des événements mouseenter/mouseleave (délégation React fragile
  // entre la barre de liens et le panneau déroulant), on suit la position
  // réelle du pointeur : tant qu'elle est dans le header (barre OU panneau),
  // le menu reste ouvert ; une fois sorti, on laisse 300 ms de grâce avant
  // de fermer — le temps de revenir sans clignotement.
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMega(null), 300);
  };

  useEffect(() => {
    if (!openMega) {
      cancelClose();
      return;
    }
    const onPointerMove = (e: MouseEvent) => {
      const header = headerRef.current;
      if (!header) return;
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      if (hit && header.contains(hit)) cancelClose();
      else scheduleClose();
    };
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      cancelClose();
    };
  }, [openMega]);

  // Escape ferme les menus déroulants
  useEffect(() => {
    if (!openMega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMega(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMega]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeAll = () => { setOpen(false); setOpenMega(null); setMobileSection(null); };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-cream-300/80 bg-cream-100/85 backdrop-blur-md no-print"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="RodLab Studio — Accueil" onClick={closeAll}>
          <Logo size="sm" />
        </Link>

        {/* ————— Navigation desktop ————— */}
        {/* « Accueil » est de retour (v8.6) en tête de barre : c'est le repère
            naturel de l'utilisateur. La hiérarchie reste Services → contenu → Agence. */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigation principale">
          {NAV.main.map((link) => {
            const hasMega = "mega" in link && link.mega;
            return (
              <div key={link.href} className="relative">
                <Link
                  href={link.href}
                  onMouseEnter={() => hasMega && setOpenMega((link as { mega?: string }).mega as "services" | "agence")}
                  onFocus={() => hasMega && setOpenMega((link as { mega?: string }).mega as "services" | "agence")}
                  onClick={closeAll}
                  aria-haspopup={hasMega ? "true" : undefined}
                  aria-expanded={hasMega ? openMega === link.mega : undefined}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive(link.href) ? "bg-terra-100 text-terra-700" : "text-ink-700 hover:bg-cream-200 hover:text-ink-900"
                  }`}
                >
                  {link.label}
                  {hasMega && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMega === link.mega ? "rotate-180" : ""}`} aria-hidden="true" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* ————— Actions (droite) — ordre : utilitaire → connexion → CTA ————— */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/telecharger"
            title="Télécharger l'application"
            aria-label="Télécharger l'application"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-white text-forest-700 transition hover:border-forest-300 hover:bg-forest-50"
          >
            <Download className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          {!user && (
            <Link
              href="/connexion"
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-cream-200"
            >
              Connexion
            </Link>
          )}
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-full bg-terra-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-terra-700"
          >
            Devis gratuit
          </Link>
          {user && (
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-forest-800"
            >
              Mon espace
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-300 bg-card text-ink-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ————— Mega menu Services ————— */}
      {openMega === "services" && (
        <div className="absolute inset-x-0 top-16 hidden border-b border-cream-300 bg-cream-100 shadow-lift lg:block" onMouseEnter={cancelClose}>
          <div className="mx-auto grid max-w-7xl gap-8 px-8 py-8 lg:grid-cols-[1fr_260px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => {
                const Icon = SERVICE_ICONS[s.icon as keyof typeof SERVICE_ICONS] ?? Palette;
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={closeAll}
                    className="group flex gap-4 rounded-2xl border border-transparent p-4 transition hover:border-cream-300 hover:bg-white"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra-100 text-terra-600 transition group-hover:bg-terra-600 group-hover:text-white">
                      <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink-900">{s.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">{s.short}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-forest-900 p-6 text-cream-100">
              <div>
                <p className="font-display text-lg font-semibold text-cream-50">Tous nos services</p>
                <p className="mt-2 text-xs leading-relaxed text-forest-100/70">
                  Quatre expertises complémentaires, un seul interlocuteur. Formules transparentes à partir de 35 000 FCFA.
                </p>
              </div>
              <Link
                href="/services"
                onClick={closeAll}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-2.5 text-xs font-bold text-forest-900 transition hover:bg-gold-300"
              >
                Comparer les formules <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ————— Dropdown Agence ————— */}
      {openMega === "agence" && (
        <div className="absolute inset-x-0 top-16 hidden border-b border-cream-300 bg-cream-100 shadow-lift lg:block" onMouseEnter={cancelClose}>
          <div className="mx-auto max-w-7xl px-8 py-6">
            <div className="grid max-w-2xl grid-cols-2 gap-2">
              {NAV.agence.map((item) => {
                const Icon = AGENCE_ICONS[item.href as keyof typeof AGENCE_ICONS] ?? Info;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAll}
                    className="group flex items-start gap-3 rounded-2xl border border-transparent p-4 transition hover:border-cream-300 hover:bg-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-600 transition group-hover:bg-forest-700 group-hover:text-white">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink-900">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-ink-500">{item.desc}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ————— Menu mobile ————— */}
      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-cream-300 bg-cream-100 px-4 pb-6 pt-3 lg:hidden">
          <nav className="grid gap-1" aria-label="Navigation mobile">
            <Link href="/" onClick={closeAll} className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${isActive("/") ? "bg-terra-100 text-terra-700" : "text-ink-700"}`}>
              Accueil
            </Link>

            <button
              onClick={() => setMobileSection((s) => (s === "services" ? null : "services"))}
              aria-expanded={mobileSection === "services"}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-700"
            >
              Services
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileSection === "services" ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {mobileSection === "services" && (
              <div className="ml-3 grid gap-1 border-l-2 border-cream-300 pl-3">
                <Link href="/services" onClick={closeAll} className="rounded-lg px-3 py-2 text-sm font-semibold text-terra-700">
                  Tous les services & tarifs
                </Link>
                {SERVICES.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} onClick={closeAll} className="rounded-lg px-3 py-2 text-sm text-ink-700">
                    {s.title}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/formation" onClick={closeAll} className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${isActive("/formation") ? "bg-terra-100 text-terra-700" : "text-ink-700"}`}>
              Formation
            </Link>

            <Link href="/live" onClick={closeAll} className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${isActive("/live") ? "bg-terra-100 text-terra-700" : "text-ink-700"}`}>
              Live
            </Link>

            <Link href="/realisations" onClick={closeAll} className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${isActive("/realisations") ? "bg-terra-100 text-terra-700" : "text-ink-700"}`}>
              Réalisations
            </Link>

            <button
              onClick={() => setMobileSection((s) => (s === "agence" ? null : "agence"))}
              aria-expanded={mobileSection === "agence"}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-700"
            >
              Agence
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileSection === "agence" ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {mobileSection === "agence" && (
              <div className="ml-3 grid gap-1 border-l-2 border-cream-300 pl-3">
                {NAV.agence.map((item) => (
                  <Link key={item.href} href={item.href} onClick={closeAll} className="rounded-lg px-3 py-2 text-sm text-ink-700">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/contact" onClick={closeAll} className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${isActive("/contact") ? "bg-terra-100 text-terra-700" : "text-ink-700"}`}>
              Contact
            </Link>

            <Link
              href="/telecharger"
              onClick={closeAll}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium ${isActive("/telecharger") ? "bg-terra-100 text-terra-700" : "text-ink-700"}`}
            >
              Télécharger l&apos;application
              <Download className="h-4 w-4 text-forest-600" aria-hidden="true" />
            </Link>
          </nav>

          <div className="mt-4 grid gap-2">
            <Link href="/contact" onClick={closeAll} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-terra-600 px-5 py-3 text-sm font-semibold text-cream-50">
              <FileText className="h-4 w-4" aria-hidden="true" /> Demander un devis gratuit
            </Link>
            {user ? (
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                onClick={closeAll}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-forest-700 px-5 py-3 text-sm font-semibold text-cream-50"
              >
                Accéder à mon espace <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/connexion" onClick={closeAll} className="inline-flex items-center justify-center rounded-full border border-cream-400 px-5 py-3 text-sm font-semibold text-ink-700">
                  Connexion
                </Link>
                <Link href="/inscription" onClick={closeAll} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-cream-50">
                  Espace client <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
