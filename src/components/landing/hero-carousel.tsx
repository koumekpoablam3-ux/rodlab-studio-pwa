"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Carrousel de fond de l'accueil : les trois visuels officiels RodLab Studio
 * défilent automatiquement (translation horizontale, boucle infinie).
 * - Pause totale si l'utilisateur préfère réduire les animations
 * - Voiles dégradés pour préserver la lisibilité du texte du héros
 */
const SLIDES = [
  {
    src: "/images/site/carousel-formation.jpg",
    alt: "Session de formation RodLab Studio — Nous formons les talents de demain",
  },
  {
    src: "/images/site/carousel-agence.jpg",
    alt: "Espace de travail RodLab Studio — Des idées aujourd'hui, les solutions de demain",
  },
  {
    src: "/images/site/carousel-bureau.jpg",
    alt: "Bureau RodLab Studio — De grandes idées pour un meilleur demain",
  },
] as const;

const INTERVAL_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Piste coulissante : un visuel par « page » de 100 % de largeur */}
      <div
        className="flex h-full w-full transition-transform duration-[1400ms] ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0">
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              quality={75}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Voiles de lisibilité : crème côté texte, plus léger à droite + fondu bas */}
      <div className="absolute inset-0 bg-gradient-to-r from-cream-50 via-cream-50/85 to-cream-50/40" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-cream-50" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cream-50/90 to-transparent" />

      {/* Indicateurs de slide (pointillés, discrets) */}
      <div className="absolute bottom-16 right-4 hidden items-center gap-2 sm:right-8 lg:flex">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-7 bg-terra-600" : "w-2.5 bg-ink-900/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
