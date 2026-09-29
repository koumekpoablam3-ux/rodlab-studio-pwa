import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = { title: "Hors ligne" };

export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-cream-100 bg-hero-glow px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-forest-100 mb-6">
        <WifiOff className="h-10 w-10 text-forest-700" aria-hidden="true" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-3">
        Vous êtes hors ligne
      </h1>
      <p className="max-w-md text-ink-500 mb-8 leading-relaxed">
        Pas d&apos;inquiétude : l&apos;application RodLab Studio reste installée sur votre
        appareil. Reconnectez-vous à Internet pour retrouver vos projets, devis et messages.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-terra-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700"
      >
        Réessayer
      </Link>
    </div>
  );
}
