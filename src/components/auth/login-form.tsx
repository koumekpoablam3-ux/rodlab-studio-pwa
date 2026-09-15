"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("erreur");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(urlError === "acces-refuse" ? "Accès refusé : cette zone est réservée aux administrateurs." : null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res: Awaited<ReturnType<typeof signIn>> | undefined;
    try {
      res = await signIn("credentials", { email, password, redirect: false });
    } catch {
      // Serveur injoignable (coupure réseau, redémarrage, mode hors-ligne…)
      setError("Impossible de joindre le serveur. Vérifiez votre connexion internet, puis réessayez dans un instant.");
      setLoading(false);
      return;
    }

    if (!res || res.error) {
      if (res?.error === "CredentialsSignin") {
        setError("Email ou mot de passe incorrect. Vérifiez la saisie (attention aux majuscules), puis réessayez.");
      } else {
        // Erreur de configuration / serveur : on ne dit pas « identifiants incorrects »
        setError(
          "La connexion au serveur d'authentification a échoué. Sur votre ordinateur : arrêtez le serveur (Ctrl + C), lancez « npm install », puis redémarrez avec « npm run dev ». Consultez la section Dépannage du README si le problème persiste."
        );
      }
      setLoading(false);
      return;
    }

    try {
      // Redirection selon le rôle (le token est posé, on interroge la session)
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;
      router.push(callbackUrl || (role === "ADMIN" ? "/admin" : "/dashboard"));
      router.refresh();
    } catch {
      setError("Connexion établie mais la session n'a pas pu être vérifiée. Rechargez la page puis réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center lg:text-left">
        <Link href="/" className="inline-flex">
          <Logo size="md" />
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">Bon retour parmi nous</h1>
        <p className="mt-2 text-sm text-ink-500">
          Connectez-vous pour accéder à votre espace sécurisé RodLab Studio.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.tg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-white pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-terra-600 text-sm font-semibold text-white transition hover:bg-terra-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
          Se connecter
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-terra-600 hover:text-terra-700">
          Créer un espace client
        </Link>
      </p>
    </div>
  );
}
