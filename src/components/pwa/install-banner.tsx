"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Download, X, Smartphone, CheckCircle2 } from "lucide-react";
import { useInstallPrompt } from "@/components/pwa/install-prompt";

const DISMISS_KEY = "rodlab-install-banner";
const DISMISS_DAYS = 7;

function wasRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // stockage indisponible : la bannière réapparaîtra, ce n'est pas grave
  }
}

/**
 * Bannière « Installez l'application » (v8.6).
 *
 * - Android / Chrome / Edge (desktop) : capte `beforeinstallprompt`, le bouton
 *   « Installer » ouvre la fenêtre native du navigateur → l'utilisateur confirme
 *   → la PWA est installée sur le PC ou le téléphone.
 * - iOS (pas de prompt natif) : la bannière guide vers les instructions
 *   « Partager → Sur l'écran d'accueil » de la page /telecharger.
 *
 * Elle s'affiche après 4 s, une fois par session, sauf si :
 * l'app est déjà installée, ou l'utilisateur a choisi « Plus tard » (< 7 jours).
 */
export function InstallBanner() {
  const { canInstall, isInstalled, platform, promptInstall } = useInstallPrompt();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready || isInstalled) return;
    if (pathname.startsWith("/telecharger")) return;
    if (!canInstall && platform !== "ios") return;
    if (wasRecentlyDismissed()) return;
    setVisible(true);
  }, [ready, isInstalled, canInstall, platform, pathname]);

  // Publie la visibilité de la bannière (le chatbot se décale au-dessus d'elle)
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.setAttribute("data-install-banner", "open");
    else root.removeAttribute("data-install-banner");
    return () => root.removeAttribute("data-install-banner");
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    rememberDismissal();
  }, []);

  const install = useCallback(async () => {
    setPending(true);
    try {
      const outcome = await promptInstall();
      if (outcome === "accepted") {
        setVisible(false);
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 8000);
      } else if (outcome === "dismissed") {
        setVisible(false);
        rememberDismissal();
      }
    } finally {
      setPending(false);
    }
  }, [promptInstall]);

  // Confirmation discrète après installation réussie
  if (justInstalled) {
    return (
      <div
        className="fixed inset-x-4 bottom-4 z-[70] sm:left-auto sm:right-6 sm:w-96"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-forest-300 bg-white p-4 shadow-lift">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-xs leading-relaxed text-ink-700">
            <strong className="text-ink-900">RodLab Studio est installé !</strong> Retrouvez l&apos;application
            sur votre écran d&apos;accueil ou votre bureau.
          </p>
        </div>
      </div>
    );
  }

  if (!visible) return null;

  const isIos = platform === "ios";

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-[70] animate-install-banner sm:left-auto sm:right-6 sm:w-96"
      role="dialog"
      aria-label="Installer l'application RodLab Studio"
    >
      <div className="overflow-hidden rounded-2xl border border-forest-700 bg-forest-900 text-cream-50 shadow-lift">
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400">
            <Smartphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug">
              {isIos ? "Ajoutez RodLab Studio à votre écran d'accueil" : "Installez RodLab Studio sur votre appareil"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-forest-100/75">
              {isIos
                ? "Utilisez l'app comme une vraie application, même hors ligne. Installation en 20 secondes."
                : "Accès direct depuis votre écran d'accueil ou bureau, même hors ligne. C'est instantané et gratuit."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isIos ? (
                <Link
                  href="/telecharger#installer"
                  onClick={dismiss}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2 text-xs font-bold text-forest-900 transition hover:bg-gold-300"
                >
                  Voir comment installer <Download className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={install}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2 text-xs font-bold text-forest-900 transition hover:bg-gold-300 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  {pending ? "Ouverture…" : "Installer l'application"}
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full px-3 py-2 text-xs font-medium text-forest-100/70 transition hover:text-cream-50"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fermer"
            className="shrink-0 rounded-full p-1 text-forest-100/60 transition hover:bg-white/10 hover:text-cream-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
