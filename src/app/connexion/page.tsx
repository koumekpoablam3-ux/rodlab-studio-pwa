import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { LogoMark } from "@/components/brand";
import { Quote } from "lucide-react";

export const metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Panneau de marque — visuel RodLab en fond */}
      <div className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-forest-900 px-8 py-10 text-cream-100 sm:min-h-[600px] lg:min-h-screen lg:w-[42%] lg:px-14 lg:py-14">
        <Image
          src="/images/site/hero-formation.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 42vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Voiles forêt pour la lisibilité, sans masquer le visuel */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-900/90 via-forest-900/30 to-forest-900/90"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-forest-900/80 to-transparent"
          aria-hidden="true"
        />

        <div className="relative">
          <LogoMark className="h-14 w-14 rounded-2xl" />
          <h2 className="mt-10 max-w-md font-display text-3xl font-semibold leading-tight text-cream-50 drop-shadow-sm lg:text-4xl">
            Votre vision, notre expertise.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-100/90 drop-shadow-sm">
            Design graphique, développement numérique et formation professionnelle à Lomé, Togo.
            Suivez vos projets, devis et factures en temps réel — même hors ligne grâce à
            l&apos;application.
          </p>
        </div>

        <figure className="relative mt-10 max-w-md rounded-2xl border border-forest-700/70 bg-forest-900/70 p-5 backdrop-blur">
          <Quote className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <blockquote className="mt-2 text-sm leading-relaxed text-cream-100">
            RodLab a transformé notre petite boutique en une vraie machine de vente en ligne.
            L&apos;équipe est restée disponible bien après la mise en ligne.
          </blockquote>
          <figcaption className="mt-3 text-xs text-forest-200/90">
            Aïcha K. — Gérante, Kafo Market
          </figcaption>
        </figure>
      </div>

      {/* Formulaire */}
      <div className="flex flex-1 items-center justify-center bg-cream-100 bg-hero-glow px-5 py-10 sm:px-8">
        <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-cream-200" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
