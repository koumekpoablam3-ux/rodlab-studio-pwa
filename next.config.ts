import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Masque le bouton dev « N » (Next.js Dev Tools) en bas à gauche de l'écran
  devIndicators: false,
};

export default nextConfig;
