import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Force le runtime Node.js (recommandé par Next.js depuis la v15 pour le
// middleware — évite certains bugs de manifeste sur l'edge runtime chez
// certains hébergeurs, dont Vercel).
export const runtime = "nodejs";

/**
 * Protection des routes :
 *  - /admin/**      → rôle ADMIN uniquement
 *  - /dashboard/**  → tout utilisateur connecté (CLIENT, ENTREPRISE, ADMIN)
 *  - /connexion, /inscription → redirige vers l'espace si déjà connecté
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname.startsWith("/admin");
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isAuthPage = pathname === "/connexion" || pathname === "/inscription";

    if (isAuthPage && token) {
      const url = req.nextUrl.clone();
      url.pathname = token.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && token?.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = token ? "/dashboard" : "/connexion";
      url.searchParams.set("erreur", "acces-refuse");
      return NextResponse.redirect(url);
    }

    if (isDashboardRoute && !token) {
      const url = req.nextUrl.clone();
      url.pathname = "/connexion";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // On exécute le middleware partout sauf ressources statiques / API NextAuth
      authorized: () => true,
    },
    pages: {
      signIn: "/connexion",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/connexion", "/inscription"],
};
