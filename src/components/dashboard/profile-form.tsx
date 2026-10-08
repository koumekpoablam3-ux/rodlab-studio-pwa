"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, KeyRound, Palette, UserRound, Mail, Phone, Briefcase, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/brand";
import { compressImage } from "@/lib/image-compress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_LABELS, Role, AVATAR_COLORS } from "@/lib/roles";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  jobTitle: string | null;
  companyName: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatarColor: string | null;
  avatarUrl?: string | null;
  createdAt: string | Date;
};

export function ProfileForm({ user, variant }: { user: ProfileUser; variant: "admin" | "client" }) {
  const router = useRouter();
  const isEntreprise = user.role === "ENTREPRISE";

  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    jobTitle: user.jobTitle ?? "",
    companyName: user.companyName ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
    country: user.country ?? "Togo",
    avatarColor: user.avatarColor ?? "#bd4f2b",
  });
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string | null>(user.avatarUrl ?? null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  async function uploadPhoto(file?: File | null) {
    if (!file) return;
    setPhotoBusy(true);
    try {
      const small = await compressImage(file, 512, 0.85);
      const body = new FormData();
      body.append("file", small);
      const res = await fetch("/api/profile/avatar", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Échec de l'envoi");
      setPhoto(data.url);
      toast.success("Photo de profil mise à jour");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setPhotoBusy(false);
      if (photoInput.current) photoInput.current.value = "";
    }
  }

  async function removePhoto() {
    setPhotoBusy(true);
    const res = await fetch("/api/profile/avatar", { method: "DELETE" });
    setPhotoBusy(false);
    if (!res.ok) { toast.error("Impossible de retirer la photo"); return; }
    setPhoto(null);
    toast.success("Photo retirée");
    router.refresh();
  }

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Impossible d'enregistrer le profil");
      return;
    }
    toast.success("Profil mis à jour");
    router.refresh();
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) {
      toast.error("Les deux mots de passe ne correspondent pas");
      return;
    }
    setSavingPwd(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }),
    });
    const data = await res.json();
    setSavingPwd(false);
    if (!res.ok) {
      toast.error(data.error ?? "Impossible de changer le mot de passe");
      return;
    }
    toast.success("Mot de passe modifié avec succès");
    setPwd({ currentPassword: "", newPassword: "", confirm: "" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Carte identité */}
      <div className="h-fit rounded-3xl border border-cream-300 bg-card p-6 text-center shadow-card">
        <div className="flex justify-center">
          <Avatar name={isEntreprise ? form.companyName || form.name : form.name} color={form.avatarColor} src={photo} size="lg" className="h-24 w-24 text-3xl" />
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => uploadPhoto(e.target.files?.[0])} />
          <button type="button" onClick={() => photoInput.current?.click()} disabled={photoBusy} className="rounded-full bg-forest-900 px-4 py-1.5 text-xs font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
            {photoBusy ? "Envoi…" : photo ? "Changer la photo" : "Ajouter une photo"}
          </button>
          {photo && (
            <button type="button" onClick={removePhoto} disabled={photoBusy} className="rounded-full border border-cream-300 px-4 py-1.5 text-xs font-medium text-ink-600 hover:bg-cream-100 disabled:opacity-60">
              Retirer
            </button>
          )}
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
          {isEntreprise ? form.companyName || form.name : form.name}
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">{form.jobTitle || ROLE_LABELS[user.role as Role]}</p>
        <span className="mt-3 inline-flex rounded-full border border-cream-300 bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-700">
          {ROLE_LABELS[user.role as Role]}
        </span>
        <dl className="mt-5 space-y-2.5 border-t border-cream-200 pt-5 text-left text-sm">
          <div className="flex items-center gap-2.5 text-ink-700">
            <Mail className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-ink-700">
            <Phone className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
            {form.phone || "—"}
          </div>
          <div className="flex items-center gap-2.5 text-ink-700">
            <MapPin className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
            {[form.address, form.city].filter(Boolean).join(", ") || "—"}
          </div>
          <div className="flex items-center gap-2.5 text-ink-400">
            <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
            Membre depuis le {formatDate(user.createdAt)}
          </div>
        </dl>
      </div>

      <div className="space-y-6">
        {/* Édition du profil */}
        <form onSubmit={saveProfile} className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <UserRound className="h-5 w-5 text-terra-600" aria-hidden="true" />
            Informations personnelles
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-name">Nom complet *</Label>
              <Input id="pf-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-phone">Téléphone</Label>
              <Input id="pf-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+228 90 00 00 00" className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-job">Fonction</Label>
              <Input id="pf-job" value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))} className="h-11 bg-white" />
            </div>
            {isEntreprise && (
              <div className="space-y-1.5">
                <Label htmlFor="pf-company">
                  <Building2 className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Entreprise
                </Label>
                <Input id="pf-company" value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} className="h-11 bg-white" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="pf-address">Adresse</Label>
              <Input id="pf-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pf-city">Ville</Label>
                <Input id="pf-city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pf-country">Pays</Label>
                <Input id="pf-country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="h-11 bg-white" />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Label className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-terra-600" aria-hidden="true" /> Couleur d&apos;avatar
            </Label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, avatarColor: c }))}
                  aria-label={`Choisir la couleur ${c}`}
                  className={cn("h-9 w-9 rounded-full border-2 transition", form.avatarColor === c ? "scale-110 border-ink-900" : "border-transparent hover:scale-105")}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              Enregistrer les modifications
            </button>
          </div>
        </form>

        {/* Changement de mot de passe */}
        <form onSubmit={changePassword} className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <KeyRound className="h-5 w-5 text-forest-600" aria-hidden="true" />
            Sécurité — mot de passe
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="pwd-current">Mot de passe actuel</Label>
              <Input id="pwd-current" type="password" required value={pwd.currentPassword} onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-new">Nouveau</Label>
              <Input id="pwd-new" type="password" required minLength={8} value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-confirm">Confirmer</Label>
              <Input id="pwd-confirm" type="password" required value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} className="h-11 bg-white" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={savingPwd || !pwd.currentPassword || pwd.newPassword.length < 8} className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-800 disabled:opacity-60">
              {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
              Changer le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
