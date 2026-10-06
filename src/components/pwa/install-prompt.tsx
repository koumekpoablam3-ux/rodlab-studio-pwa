"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, CheckCircle2, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type Platform = "android" | "ios" | "desktop";

type InstallContextValue = {
  /** Le navigateur a accepté de montrer le prompt d'installation natif. */
  canInstall: boolean;
  /** L'app tourne déjà en mode installée (standalone). */
  isInstalled: boolean;
  /** Plateforme détectée : android, ios ou desktop. */
  platform: Platform;
  /** Déclenche le prompt d'installation natif. Retourne "accepted", "dismissed" ou "unavailable". */
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
};

const InstallContext = createContext<InstallContextValue | null>(null);

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  const isTouch = window.navigator.maxTouchPoints > 1;
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/i.test(ua) && isTouch)) return "ios";
  return "desktop";
}

function detectInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const standalone = window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: minimal-ui)").matches;
  const iosStandalone = "standalone" in window.navigator && Boolean(window.navigator.standalone);
  return standalone || iosStandalone;
}

/**
 * Capture l'événement `beforeinstallprompt` une seule fois et le partage à
 * toute l'application (bannière, navbar, page /telecharger, accueil…).
 */
export function InstallPromptProvider({ children }: { children: React.ReactNode }) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    setPlatform(detectPlatform());
    setIsInstalled(detectInstalled());

    const onPrompt = (e: Event) => {
      // Empêche Chrome d'afficher sa mini-infobar : on gère nous-mêmes l'UX.
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
      // Nettoie l'opt-out de la bannière : l'app est installée, plus besoin.
      try { localStorage.removeItem("rodlab-install-dismissed"); } catch {}
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!installEvent) return "unavailable";
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") {
        setInstallEvent(null);
        setIsInstalled(detectInstalled() || true);
        return "accepted";
      }
      return "dismissed";
    } catch {
      return "unavailable";
    }
  }, [installEvent]);

  const value = useMemo<InstallContextValue>(
    () => ({ canInstall: Boolean(installEvent), isInstalled, platform, promptInstall }),
    [installEvent, isInstalled, platform, promptInstall]
  );

  return <InstallContext.Provider value={value}>{children}</InstallContext.Provider>;
}

export function useInstallPrompt(): InstallContextValue {
  const ctx = useContext(InstallContext);
  // Valeur de repli (rendu SSR / contexte absent) : reste inerte et sûre.
  return ctx ?? { canInstall: false, isInstalled: false, platform: "desktop", promptInstall: async () => "unavailable" };
}

/* ————————————————————————————————————————————————————————————
   Bouton d'installation réutilisable.
   - canInstall       → prompt natif du navigateur
   - isInstalled      → état « installée » (CheckCircle2)
   - sinon            → renvoie vers /telecharger#installer
     (instructions manuelles selon la plateforme)
   ———————————————————————————————————————————————————————————— */
export function InstallButton({
  variant = "primary",
  size = "md",
  label = "Installer l'application",
  className = "",
}: {
  variant?: "primary" | "light" | "outline";
  size?: "md" | "lg";
  label?: string;
  className?: string;
}) {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  const sizeCls = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  const base = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition ${sizeCls}`;

  if (isInstalled) {
    return (
      <span className={`${base} cursor-default border border-forest-200 bg-forest-50 text-forest-700 ${className}`}>
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        Application installée
      </span>
    );
  }

  if (canInstall) {
    const styles =
      variant === "light"
        ? "bg-cream-50 text-forest-900 hover:bg-white shadow-chip"
        : variant === "outline"
          ? "border border-cream-100/40 bg-white/10 text-cream-50 backdrop-blur hover:bg-white/20"
          : "bg-terra-600 text-cream-50 shadow-chip hover:bg-terra-700";
    return (
      <button
        type="button"
        onClick={async () => {
          setPending(true);
          await promptInstall();
          setPending(false);
        }}
        disabled={pending}
        className={`${base} ${styles} ${className}`}
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        {pending ? "Installation…" : label}
      </button>
    );
  }

  // Pas de prompt dispo (iOS, navigateur non compatible, ou event pas encore reçu)
  // → guide l'utilisateur vers la page de téléchargement.
  const href = pathname === "/telecharger" ? "#installer" : "/telecharger";
  const styles =
    variant === "light"
      ? "bg-cream-50 text-forest-900 hover:bg-white shadow-chip"
      : variant === "outline"
        ? "border border-cream-100/40 bg-white/10 text-cream-50 backdrop-blur hover:bg-white/20"
        : "bg-terra-600 text-cream-50 shadow-chip hover:bg-terra-700";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      <Smartphone className="h-5 w-5" aria-hidden="true" />
      {pathname === "/telecharger" ? "Voir comment installer" : "Télécharger l'application"}
    </Link>
  );
}
