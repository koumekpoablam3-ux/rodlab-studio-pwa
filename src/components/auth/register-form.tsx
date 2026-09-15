"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Building2, Loader2, UserRound, UserPlus } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"CLIENT" | "ENTREPRISE">("CLIENT");
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", companyName: "", jobTitle: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue");
        setLoading(false);
        return;
      }

      // Connexion automatique après inscription
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Impossible de créer le compte pour le moment");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex">
          <Logo size="md" />
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">Créer votre espace</h1>
        <p className="mt-2 text-sm text-ink-500">
          Suivez vos projets, devis et factures en direct avec l&apos;équipe RodLab Studio.
        </p>
      </div>

      {/* Choix du type de compte */}
      <div className="mb-6 grid grid-cols-2 gap-3" role="tablist" aria-label="Type de compte">
        <button
          type="button"
          role="tab"
          aria-selected={role === "CLIENT"}
          onClick={() => setRole("CLIENT")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-center transition",
            role === "CLIENT"
              ? "border-terra-600 bg-terra-50 text-terra-700 shadow-chip"
              : "border-cream-300 bg-card text-ink-500 hover:border-cream-400"
          )}
        >
          <UserRound className="h-6 w-6" aria-hidden="true" />
          <span className="text-sm font-semibold">Client</span>
          <span className="text-xs leading-snug opacity-80">Particulier ou indépendant</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === "ENTREPRISE"}
          onClick={() => setRole("ENTREPRISE")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-center transition",
            role === "ENTREPRISE"
              ? "border-terra-600 bg-terra-50 text-terra-700 shadow-chip"
              : "border-cream-300 bg-card text-ink-500 hover:border-cream-400"
          )}
        >
          <Building2 className="h-6 w-6" aria-hidden="true" />
          <span className="text-sm font-semibold">Entreprise</span>
          <span className="text-xs leading-snug opacity-80">Avec gestion d&apos;équipe</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nom complet *</Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Ex. Kossi Amégan" className="h-11 bg-white" />
          </div>
          {role === "ENTREPRISE" && (
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
              <Input id="companyName" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required placeholder="Ex. Hôtel Palma" className="h-11 bg-white" />
            </div>
          )}
          {role === "CLIENT" && (
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Fonction</Label>
              <Input id="jobTitle" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Ex. Restaurateur" className="h-11 bg-white" />
            </div>
          )}
        </div>

        {role === "ENTREPRISE" && (
          <div className="space-y-1.5">
            <Label htmlFor="jobTitle2">Votre fonction</Label>
            <Input id="jobTitle2" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Ex. Directeur général" className="h-11 bg-white" />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse email *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="vous@exemple.tg" className="h-11 bg-white" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+228 90 00 00 00" className="h-11 bg-white" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe *</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} placeholder="8 caractères minimum" className="h-11 bg-white" />
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
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
          Créer mon espace {role === "ENTREPRISE" ? "entreprise" : "client"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500">
        Vous avez déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-terra-600 hover:text-terra-700">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
