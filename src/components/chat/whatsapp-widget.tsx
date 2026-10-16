"use client";

import { useState } from "react";
import { X, ArrowRight, PencilLine } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const WHATSAPP_NUMBER = "22870088668";

const QUICK_REPLIES = [
  "Bonjour, j'ai une question.",
  "J'ai besoin d'aide.",
  "Je veux signaler un problème technique.",
  "J'ai une proposition d'amélioration.",
];

function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Icône WhatsApp (glyphe simplifié, pour ne pas dépendre d'un set d'icônes de marque). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.36 4 15c0 2.4.7 4.63 1.9 6.5L4.5 27l5.66-1.36A11.9 11.9 0 0 0 16.02 27C22.64 27 28 21.64 28 15S22.64 3 16.02 3Zm6.98 16.5c-.3.85-1.66 1.63-2.3 1.7-.6.08-1.3.11-2.1-.13a14.4 14.4 0 0 1-3.7-1.7c-2.47-1.5-4.08-3.9-4.28-4.2-.2-.3-1-1.42-1-2.7s.63-1.9.85-2.16c.22-.26.5-.32.66-.32h.5c.16 0 .38-.06.6.46.22.53.75 1.85.82 1.98.07.13.12.29.02.47-.1.18-.16.29-.3.45-.15.16-.32.36-.45.48-.16.15-.32.31-.14.6.2.32.85 1.4 1.83 2.28 1.26 1.13 2.32 1.49 2.66 1.65.34.16.53.13.73-.08.2-.22.83-.97 1.05-1.3.22-.34.44-.28.74-.17.3.1 1.9.9 2.22 1.06.32.16.53.24.6.38.08.14.08.79-.22 1.64Z" />
    </svg>
  );
}

export function WhatsAppSupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-[68px] left-0 w-[min(92vw,320px)] overflow-hidden rounded-2xl border border-cream-300 bg-card shadow-2xl"
          >
            {/* En-tête */}
            <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <WhatsAppIcon className="h-5 w-5 text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">Support RodLab Studio</p>
                <p className="flex items-center gap-1 text-[11px] text-white/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" /> En ligne · répond vite
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="shrink-0 text-white/80 transition hover:text-white"
              >
                <X className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>

            {/* Corps */}
            <div className="max-h-[60vh] space-y-2.5 overflow-y-auto bg-cream-50/60 p-4">
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-ink-800 shadow-sm">
                👋 Bonjour ! Comment pouvons-nous vous aider ?
              </div>

              <div className="space-y-2 pt-1">
                {QUICK_REPLIES.map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    onClick={() => openWhatsApp(msg)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-left text-sm text-ink-800 transition hover:border-[#25D366] hover:bg-[#25D366]/5"
                  >
                    {msg}
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#25D366]" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openWhatsApp("")}
                className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink-500 underline-offset-2 transition hover:text-forest-700 hover:underline"
              >
                <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
                Écrire un message personnalisé →
              </button>
            </div>

            {/* Pied */}
            <div className="border-t border-cream-200 bg-white px-4 py-2.5 text-center text-[11px] text-ink-400">
              Vous serez redirigé vers WhatsApp
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le support WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-terra-500 ring-2 ring-white">
            <span className="h-full w-full animate-ping rounded-full bg-terra-400 opacity-75" />
          </span>
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <X className="h-6 w-6" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span key="wa" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
              <WhatsAppIcon className="h-7 w-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
