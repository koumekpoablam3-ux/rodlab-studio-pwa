"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/brand";

/**
 * Écran d'ouverture animé, affiché une fois par session à l'arrivée sur le site
 * public — une démonstration de l'esthétique RodLab avant de révéler l'accueil.
 *
 * Décisions volontaires :
 *  - Une seule fois par session (sessionStorage) : on ne fait pas revivre 10 s
 *    d'animation à un visiteur qui navigue déjà sur le site ou revient plus tard.
 *  - prefers-reduced-motion respecté : l'animation complète est remplacée par un
 *    fondu quasi immédiat, sans mouvement, pour les personnes qui l'ont demandé.
 *  - Le contenu réel de la page reste dans le DOM en dessous (pas de retard
 *    artificiel pour le SEO ou les robots) : seul l'affichage visuel est retardé.
 */
export function SplashScreen() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false); // évite un flash avant de connaître sessionStorage

  useEffect(() => {
    const seen = sessionStorage.getItem("rodlab_splash_seen");
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem("rodlab_splash_seen", "1");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = prefersReducedMotion ? 400 : 10000;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [visible, prefersReducedMotion]);

  if (!ready || !visible) return null;

  if (prefersReducedMotion) {
    // Pas d'animation : un simple fondu très court, juste le temps de ne pas
    // faire de saut brutal à l'affichage.
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-900"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onAnimationComplete={() => setVisible(false)}
      >
        <LogoMark className="h-16 w-16" />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-forest-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
        >
          {/* Formes de marque en mouvement lent, en arrière-plan */}
          <motion.span
            className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-terra-600/20 blur-3xl"
            animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl"
            animate={{ x: [0, -30, 20, 0], y: [0, -20, 15, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Anneau qui tourne autour du logo */}
          <div className="relative flex h-28 w-28 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-dashed border-gold-400/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-3 rounded-full border border-terra-400/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <LogoMark className="h-16 w-16 shadow-lg" />
            </motion.div>
          </div>

          {/* Nom de la marque */}
          <motion.p
            className="mt-7 font-display text-2xl font-semibold tracking-tight text-cream-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            RodLab <span className="text-gold-400">Studio</span>
          </motion.p>

          {/* Slogan */}
          <motion.p
            className="mt-2 text-sm tracking-wide text-cream-100/70"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Votre vision, notre expertise.
          </motion.p>

          {/* Mots-clés qui défilent, un par un — la « gymnastique » qui montre le savoir-faire */}
          <div className="mt-8 h-6 overflow-hidden">
            <RotatingWords />
          </div>

          {/* Barre de progression, calée sur la durée totale (10 s) */}
          <div className="absolute bottom-14 h-[3px] w-48 overflow-hidden rounded-full bg-cream-50/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-terra-500 via-gold-400 to-terra-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          </div>

          {/* Passer l'animation — accessible dès le début, discret */}
          <motion.button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-6 text-xs font-medium text-cream-100/50 underline-offset-4 transition hover:text-cream-50 hover:underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Passer l&apos;introduction
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const WORDS = ["Design", "Développement", "Formation", "Communication", "Excellence"];

function RotatingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={WORDS[index]}
        className="block text-xs font-semibold uppercase tracking-[0.2em] text-terra-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
      >
        {WORDS[index]}
      </motion.span>
    </AnimatePresence>
  );
}
