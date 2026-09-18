"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Smartphone, TabletSmartphone, MonitorSmartphone } from "lucide-react";
import { useInstallPrompt } from "@/components/pwa/install-prompt";

/**
 * Carte QR code : encode l'adresse actuelle du site pour l'ouvrir
 * instantanément sur le téléphone (et l'installer depuis là-bas).
 * Rendu client uniquement : l'origine n'est connue que dans le navigateur.
 */
export function DownloadQrCard({ compact = false }: { compact?: boolean }) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin + "/telecharger");
  }, []);

  return (
    <div className={`flex flex-col items-center rounded-3xl border border-cream-300 bg-white p-6 text-center shadow-card ${compact ? "" : "sm:p-8"}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
        <QrCode className="h-5.5 w-5.5" aria-hidden="true" />
      </span>
      <p className="mt-3 font-display text-base font-semibold text-ink-900">
        Scannez pour installer
      </p>
      <div className="mt-4 rounded-2xl border border-cream-200 bg-cream-50 p-3">
        {origin ? (
          <QRCodeSVG
            value={origin}
            size={compact ? 132 : 168}
            level="M"
            marginSize={1}
            bgColor="#faf6ee"
            fgColor="#102a20"
            aria-label="QR code vers la page de téléchargement"
          />
        ) : (
          <div className={`${compact ? "h-[132px] w-[132px]" : "h-[168px] w-[168px]"} animate-pulse rounded-lg bg-cream-200`} aria-hidden="true" />
        )}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        Pointez l&apos;appareil photo de votre téléphone sur ce code, puis touchez
        la bannière d&apos;installation qui s&apos;affiche en haut de l&apos;écran.
      </p>
    </div>
  );
}

/** Badge « compatible avec votre appareil » apposé sur la bonne carte d'instructions. */
export function PlatformBadge({ platform }: { platform: "android" | "ios" | "desktop" }) {
  const { platform: detected } = useInstallPrompt();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || detected !== platform) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-700">
      <Smartphone className="h-3 w-3" aria-hidden="true" />
      Votre appareil
    </span>
  );
}

/** Petit bloc récapitulatif de la plateforme détectée (hero de la page télécharger). */
export function DetectedDevice() {
  const { platform, isInstalled } = useInstallPrompt();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const label =
    platform === "android" ? "Android" : platform === "ios" ? "iPhone / iPad" : "Ordinateur";
  const Icon = platform === "desktop" ? MonitorSmartphone : platform === "ios" ? TabletSmartphone : Smartphone;

  if (isInstalled) {
    return (
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-1.5 text-xs font-semibold text-forest-700">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Application déjà installée sur cet appareil
      </p>
    );
  }

  return (
    <p className="mt-4 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-cream-400 bg-white/70 px-4 py-1.5 text-left text-xs text-ink-600">
      <Icon className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
      <span>
        Appareil détecté : <strong className="font-semibold text-ink-900">{label}</strong>
        <span className="hidden sm:inline"> — suivez le guide ci-dessous</span>
      </span>
    </p>
  );
}
