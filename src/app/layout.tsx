import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { InstallPromptProvider } from "@/components/pwa/install-prompt";
import { InstallBanner } from "@/components/pwa/install-banner";
import { ChatWidget } from "@/components/chat/chat-widget";
import { WhatsAppSupportWidget } from "@/components/chat/whatsapp-widget";
import { PublicOnly } from "@/components/chat/public-only";
import { SITE_URL } from "@/lib/site-url";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Accepte soit le code seul, soit la balise complète copiée depuis Google
 * (<meta name="google-site-verification" content="CODE" />) : on n'en garde que le code.
 */
function verificationCode(raw?: string): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  return /content=["']([^"']+)["']/.exec(value)?.[1] ?? value.replace(/^["']|["']$/g, "");
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RodLab Studio — Agence de design, développement web et formation à Lomé",
    template: "%s · RodLab Studio",
  },
  // Adresse « officielle » de chaque page (évite le contenu en double et renforce la page d'accueil)
  alternates: { canonical: "./" },
  keywords: [
    "RodLab", "RodLab Studio", "agence digitale Lomé", "création de site web Togo", "design graphique Lomé",
    "développement web Togo", "application mobile Togo", "formation professionnelle Lomé", "e-commerce Togo",
  ],
  authors: [{ name: "RodLab Studio" }],
  creator: "RodLab Studio",
  publisher: "RodLab Studio",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "RodLab Studio",
    title: "RodLab Studio — Agence de design, développement web et formation à Lomé",
    description:
      "Sites web, e-commerce, identités visuelles, applications installables et formations certifiantes à Lomé, Togo. Espace client en ligne.",
    url: "/",
    images: [{ url: "/images/site/carousel-agence.jpg", alt: "L'équipe et les locaux de RodLab Studio à Lomé" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RodLab Studio — Agence de design, développement web et formation à Lomé",
    description: "Sites web, e-commerce, identités visuelles, applications installables et formations à Lomé, Togo.",
    images: ["/images/site/carousel-agence.jpg"],
  },
  // Codes de vérification Google / Bing (variables GOOGLE_SITE_VERIFICATION et BING_SITE_VERIFICATION)
  verification: {
    google: verificationCode(process.env.GOOGLE_SITE_VERIFICATION),
    other: verificationCode(process.env.BING_SITE_VERIFICATION)
      ? { "msvalidate.01": verificationCode(process.env.BING_SITE_VERIFICATION)! }
      : undefined,
  },
  description:
    "Agence de design graphique, développement numérique et formation professionnelle à Lomé, Togo. Espace client sécurisé, suivi de projets en temps réel, devis et factures en ligne.",
  applicationName: "RodLab Studio",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RodLab Studio",
  },
};

export const viewport: Viewport = {
  themeColor: "#102a20",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>
          <InstallPromptProvider>
            {children}
            <Toaster />
            <PwaRegister />
            <InstallBanner />
            <PublicOnly>
              <ChatWidget />
              <WhatsAppSupportWidget />
            </PublicOnly>
          </InstallPromptProvider>
        </Providers>
      </body>
    </html>
  );
}
