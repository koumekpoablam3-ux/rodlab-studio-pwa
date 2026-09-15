import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { InstallPromptProvider } from "@/components/pwa/install-prompt";
import { InstallBanner } from "@/components/pwa/install-banner";
import { ChatWidget } from "@/components/chat/chat-widget";

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

export const metadata: Metadata = {
  title: {
    default: "RodLab Studio — Votre vision, notre expertise",
    template: "%s · RodLab Studio",
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
            <ChatWidget />
          </InstallPromptProvider>
        </Providers>
      </body>
    </html>
  );
}
