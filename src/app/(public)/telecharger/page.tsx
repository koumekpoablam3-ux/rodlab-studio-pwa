import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  WifiOff, BellRing, Zap, ShieldCheck, RefreshCw, LayoutDashboard,
  ArrowRight, Apple, MonitorDown, Share, Plus, CircleCheck, Smartphone,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { InstallButton } from "@/components/pwa/install-prompt";
import { DownloadQrCard, PlatformBadge, DetectedDevice } from "@/components/landing/download-app";

export const metadata: Metadata = {
  title: "Télécharger l'application",
  description:
    "Installez l'application RodLab Studio sur votre téléphone ou votre ordinateur : suivi de projets, devis, factures et messagerie, même hors ligne. Installation directe, sans store.",
};

const FEATURES = [
  {
    icon: WifiOff,
    title: "Consultation hors-ligne",
    desc: "Vos projets, devis et factures restent consultables même sans connexion Internet — idéal sur le terrain.",
  },
  {
    icon: BellRing,
    title: "Notifications push",
    desc: "Nouveau devis, facture, message de l'équipe : vous êtes prévenu instantanément sur votre écran d'accueil.",
  },
  {
    icon: Zap,
    title: "Ultra rapide",
    desc: "L'application se lance comme une app native et met en cache vos pages : tout s'affiche en un éclair.",
  },
  {
    icon: LayoutDashboard,
    title: "Votre écran d'accueil",
    desc: "Une icône RodLab à côté de vos autres applications, en plein écran et sans barre de navigateur.",
  },
  {
    icon: RefreshCw,
    title: "Mises à jour automatiques",
    desc: "La dernière version s'installe toute seule à chaque visite : rien à télécharger, jamais.",
  },
  {
    icon: ShieldCheck,
    title: "Légère et sécurisée",
    desc: "Moins de 1 Mo installée, aucune permission intrusive, connexion chiffrée à votre espace client.",
  },
];

const GUIDE = [
  {
    platform: "android" as const,
    icon: Smartphone,
    device: "Android — Chrome, Edge, Samsung Internet",
    steps: [
      "Ouvrez votre site RodLab Studio dans le navigateur.",
      "Touchez le bouton « Installer l'application » proposé en haut de l'écran (ou le menu ⋮ puis « Installer l'application »).",
      "Confirmez : l'icône RodLab rejoint votre écran d'accueil.",
    ],
  },
  {
    platform: "ios" as const,
    icon: Apple,
    device: "iPhone & iPad — Safari",
    steps: [
      "Ouvrez votre site RodLab Studio dans Safari.",
      "Touchez le bouton Partager (le carré avec la flèche vers le haut).",
      "Faites défiler, puis choisissez « Sur l'écran d'accueil », et validez avec « Ajouter ».",
    ],
  },
  {
    platform: "desktop" as const,
    icon: MonitorDown,
    device: "Ordinateur — Chrome & Edge",
    steps: [
      "Ouvrez votre site RodLab Studio dans Chrome ou Edge.",
      "Cliquez sur l'icône d'installation qui apparaît à droite de la barre d'adresse.",
      "Ou ouvrez le menu ⋮ puis « Installer RodLab Studio… ».",
    ],
  },
];

const PHONES = [
  { src: "/screenshots/app-client-accueil.png", alt: "Accueil de l'espace client dans l'application RodLab Studio" },
  { src: "/screenshots/app-client-projets.png", alt: "Suivi des projets en temps réel dans l'application" },
  { src: "/screenshots/app-client-messagerie.png", alt: "Messagerie directe avec l'équipe RodLab" },
];

export default function TelechargerPage() {
  return (
    <>
      <PageHero
        eyebrow="Application RodLab Studio"
        title="Votre espace client, installé sur tous vos écrans"
        highlight="installé"
        description="RodLab Studio s'installe directement depuis votre navigateur, sans store ni téléchargement lourd. Projets, devis, factures et messagerie vous suivent partout — même hors ligne."
        breadcrumbs={[{ label: "Télécharger l'application" }]}
      >
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <InstallButton size="lg" label="Installer maintenant" />
            <p className="text-xs text-ink-400">
              Gratuit · Moins de 1 Mo · Android, iPhone, Windows, Mac & Linux
            </p>
          </div>
          <DetectedDevice />
        </div>
      </PageHero>

      {/* ————— INSTALLATION EXPRESS (bouton natif + QR code) ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="express-title">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest-900 p-8 text-cream-100 sm:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-forest-800 blur-2xl"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Installation express</p>
              <h2 id="express-title" className="mt-3 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                Deux façons d&apos;installer l&apos;application
              </h2>
              <ol className="mt-7 grid gap-4">
                <li className="flex gap-4 rounded-2xl border border-forest-700 bg-forest-800/60 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400 font-display text-base font-bold text-forest-900">1</span>
                  <div>
                    <p className="font-semibold text-cream-50">Sur cet appareil</p>
                    <p className="mt-1 text-sm leading-relaxed text-forest-100/75">
                      Touchez « Installer maintenant » : votre navigateur ouvre une fenêtre
                      de confirmation, et l&apos;icône RodLab s&apos;ajoute à votre écran d&apos;accueil
                      ou à votre bureau.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 rounded-2xl border border-forest-700 bg-forest-800/60 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400 font-display text-base font-bold text-forest-900">2</span>
                  <div>
                    <p className="font-semibold text-cream-50">Sur votre téléphone</p>
                    <p className="mt-1 text-sm leading-relaxed text-forest-100/75">
                      Scannez le QR code ci-contre avec l&apos;appareil photo : la page
                      s&apos;ouvre sur votre mobile, installez-la depuis là-bas en une touche.
                    </p>
                  </div>
                </li>
              </ol>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <InstallButton size="lg" variant="light" label="Installer maintenant" />
                <Link
                  href="#installer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream-100/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-cream-50 backdrop-blur transition hover:bg-white/20"
                >
                  Guide pas à pas
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          <DownloadQrCard />
        </div>
      </section>

      {/* ————— GUIDE PAR PLATEFORME ————— */}
      <section id="installer" className="scroll-mt-20 border-y border-cream-300 bg-cream-50 py-16 sm:py-20" aria-labelledby="guide-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Guide pas à pas</p>
            <h2 id="guide-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Installer sur votre appareil
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              La procédure prend moins d&apos;une minute. Votre navigateur actuel est
              automatiquement repéré : la carte correspondante est marquée
              « Votre appareil ».
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {GUIDE.map((g) => {
              const Icon = g.icon;
              return (
                <article key={g.platform} className="flex flex-col rounded-3xl border border-cream-300 bg-card p-7 shadow-card">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terra-100 text-terra-600">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <PlatformBadge platform={g.platform} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">{g.device}</h3>
                  <ol className="mt-4 grid flex-1 gap-3.5">
                    {g.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-[11px] font-bold text-forest-700">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
          <p className="mt-8 flex items-start gap-2.5 rounded-2xl border border-cream-300 bg-white p-5 text-sm leading-relaxed text-ink-500">
            <Share className="mt-0.5 h-4 w-4 shrink-0 text-terra-600" aria-hidden="true" />
            <span>
              Sur iPhone, l&apos;installation passe toujours par le bouton <strong>Partager</strong> de
              Safari puis <strong>« Sur l&apos;écran d&apos;accueil »</strong> — c&apos;est la méthode officielle
              d&apos;Apple, aucune application tierce n&apos;est nécessaire.
            </span>
          </p>
        </div>
      </section>

      {/* ————— CAPTURES D'ÉCRAN ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8" aria-labelledby="apercu-title">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Aperçu de l&apos;application</p>
          <h2 id="apercu-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Ce qui vous attend dans l&apos;application
          </h2>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-center gap-6 pb-8 sm:gap-10">
          {PHONES.map((phone, i) => (
            <div
              key={phone.src}
              className={`w-[190px] shrink-0 sm:w-[220px] ${i === 0 ? "-rotate-3" : i === 2 ? "rotate-3" : ""}`}
            >
              <div className="rounded-[2rem] border-[6px] border-ink-900 bg-ink-900 shadow-lift">
                <div className="overflow-hidden rounded-[1.6rem]">
                  <Image
                    src={phone.src}
                    alt={phone.alt}
                    width={390}
                    height={844}
                    sizes="220px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[1.75rem] border border-cream-300 shadow-lift">
          <Image
            src="/screenshots/app-admin-desktop.png"
            alt="Tableau de bord d'administration RodLab Studio sur ordinateur"
            width={1280}
            height={800}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="h-auto w-full"
          />
        </div>
      </section>

      {/* ————— ATOUTS ————— */}
      <section className="border-y border-cream-300 bg-cream-50 py-16 sm:py-20" aria-labelledby="atouts-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Pourquoi installer ?</p>
            <h2 id="atouts-title" className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Une vraie application, sans passer par un store
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title} className="rounded-3xl border border-cream-300 bg-card p-7 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                    <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
            {["Aucun compte Google ou Apple requis", "Aucun frais caché", "Désinstallable en un geste"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-forest-600" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CRÉER UN COMPTE ————— */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-cream-300 bg-white p-8 text-center shadow-card sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terra-100 text-terra-600">
            <Plus className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Pas encore d&apos;espace client ?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
            Créez votre compte en 2 minutes pour suivre vos projets, recevoir vos
            devis et échanger avec l&apos;équipe — depuis le site comme depuis
            l&apos;application installée.
          </p>
          <Link
            href="/inscription"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-ink-800"
          >
            Créer mon espace client
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
