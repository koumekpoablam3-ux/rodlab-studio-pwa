"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Crown, KeyRound, Loader2, MailCheck, Pencil, Plus, ShieldCheck, Trash2, UserCheck, UserX, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/brand";
import { PageHeader } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_PERMISSIONS, parsePermissions, PERMISSIONS, PRESETS, type Permission } from "@/lib/permissions";
import { AVATAR_COLORS } from "@/lib/roles";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

type Admin = {
  id: string; name: string; email: string; jobTitle: string | null; avatarColor: string; active: boolean;
  isDirector: boolean; permissions: string | null; invitePending: boolean; lastSeenAt: string | null; createdAt: string;
};
type LinkResult = { name: string; email: string; link: string; emailSent: boolean; kind: "invite" | "reset" };

const permLabel = (k: string) => PERMISSIONS.find((p) => p.key === k)?.label ?? k;

function PermissionPicker({ value, onChange }: { value: Permission[]; onChange: (v: Permission[]) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {PERMISSIONS.map((p) => {
        const on = value.includes(p.key);
        return (
          <label key={p.key} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition", on ? "border-forest-700 bg-forest-50" : "border-cream-300 bg-white hover:bg-cream-50")}>
            <input type="checkbox" checked={on} onChange={() => onChange(on ? value.filter((x) => x !== p.key) : [...value, p.key])} className="mt-1 h-4 w-4 accent-forest-700" />
            <span>
              <span className="block text-sm font-semibold text-ink-900">{p.label}</span>
              <span className="block text-xs text-ink-500">{p.description}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Couleur du profil">
      {AVATAR_COLORS.map((c) => (
        <button key={c} type="button" role="radio" aria-checked={value === c} aria-label={c} onClick={() => onChange(c)}
          style={{ backgroundColor: c }} className={cn("flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition", value === c && "ring-2 ring-ink-900")}>
          {value === c && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

export function AdminsBoard({ myId, admins }: { myId: string; admins: Admin[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<LinkResult | null>(null);

  // formulaire d'invitation
  const [form, setForm] = useState({ name: "", email: "", jobTitle: "", color: AVATAR_COLORS[0]!, preset: "" });
  const [perms, setPerms] = useState<Permission[]>([]);
  // formulaire de modification
  const [edit, setEdit] = useState({ name: "", jobTitle: "", color: "", perms: [] as Permission[] });

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id);
    setForm((f) => ({ ...f, preset: id, jobTitle: p ? p.jobTitle : f.jobTitle }));
    if (p) setPerms(p.permissions);
  }

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy("create");
    const { ok, data } = await call("/api/admin/admins", "POST", {
      name: form.name, email: form.email, jobTitle: form.jobTitle || null, permissions: perms, avatarColor: form.color,
    });
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Création impossible"); return; }
    setResult({ name: data.user.name, email: data.user.email, link: data.inviteLink, emailSent: data.emailSent, kind: "invite" });
    setCreating(false);
    setForm({ name: "", email: "", jobTitle: "", color: AVATAR_COLORS[0]!, preset: "" });
    setPerms([]);
    router.refresh();
  }

  function startEdit(a: Admin) {
    setEditing(a.id);
    setEdit({ name: a.name, jobTitle: a.jobTitle ?? "", color: a.avatarColor, perms: parsePermissions(a.permissions) });
  }

  async function saveEdit(a: Admin) {
    setBusy(a.id);
    const { ok, data } = await call(`/api/admin/admins/${a.id}`, "PATCH", { name: edit.name, jobTitle: edit.jobTitle || null, avatarColor: edit.color, permissions: edit.perms });
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Modification impossible"); return; }
    toast.success("Modifications enregistrées — effectives immédiatement");
    setEditing(null);
    router.refresh();
  }

  async function toggleActive(a: Admin) {
    if (a.active && !window.confirm(`Suspendre ${a.name} ? Elle n'aura plus accès à l'espace administrateur, immédiatement.`)) return;
    setBusy(a.id);
    const { ok, data } = await call(`/api/admin/admins/${a.id}`, "PATCH", { active: !a.active });
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Action impossible"); return; }
    toast.success(a.active ? "Compte suspendu" : "Compte réactivé");
    router.refresh();
  }

  async function sendLink(a: Admin) {
    setBusy(a.id);
    const { ok, data } = await call(`/api/admin/admins/${a.id}`, "PATCH", { action: "send-link" });
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Envoi impossible"); return; }
    setResult({ name: a.name, email: a.email, link: data.inviteLink, emailSent: data.emailSent, kind: data.kind });
    router.refresh();
  }

  async function remove(a: Admin) {
    if (!window.confirm(`Supprimer définitivement le compte de ${a.name} ?\n\nSes messages seront supprimés aussi. Si vous voulez seulement lui retirer l'accès, utilisez « Suspendre ».`)) return;
    setBusy(a.id);
    const { ok, data } = await call(`/api/admin/admins/${a.id}`, "DELETE");
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Suppression impossible"); return; }
    toast.success("Compte supprimé");
    router.refresh();
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); toast.success("Lien copié"); } catch { toast.error("Copie impossible : sélectionnez le lien manuellement"); }
  }

  const card = "rounded-3xl border border-cream-300 bg-card p-6 shadow-card";

  return (
    <>
      <PageHeader
        title="Administrateurs"
        description="Invitez vos collègues avec leur propre adresse email et choisissez ce que chacun peut faire. Ils définissent eux-mêmes leur mot de passe."
        actions={
          <button onClick={() => { setCreating((v) => !v); setResult(null); }} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            {creating ? <X className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {creating ? "Fermer" : "Inviter un administrateur"}
          </button>
        }
      />

      {result && (
        <section className="mb-6 rounded-3xl border border-forest-200 bg-forest-50 p-6" aria-live="polite">
          <div className="flex items-start gap-3">
            <MailCheck className="mt-0.5 h-6 w-6 shrink-0 text-forest-700" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                {result.kind === "invite" ? `Invitation prête pour ${result.name}` : `Lien de réinitialisation pour ${result.name}`}
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                {result.emailSent
                  ? <>Un email a été envoyé à <strong>{result.email}</strong>. Vous pouvez aussi lui transmettre ce lien vous-même (WhatsApp, etc.) :</>
                  : <>L&apos;envoi d&apos;emails n&apos;est pas configuré sur ce serveur : transmettez ce lien à <strong>{result.email}</strong> vous-même (WhatsApp, etc.) :</>}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input readOnly value={result.link} onFocus={(e) => e.currentTarget.select()} aria-label="Lien personnel" className="h-10 min-w-0 flex-1 rounded-xl border border-cream-300 bg-white px-3 text-xs" />
                <button onClick={() => copy(result.link)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest-900 px-4 text-xs font-semibold text-cream-50 hover:bg-forest-700"><Copy className="h-4 w-4" aria-hidden="true" /> Copier</button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Bonjour ${result.name.split(" ")[0]}, voici votre lien pour créer votre mot de passe RodLab Studio : ${result.link}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-xl border border-cream-300 bg-white px-4 text-xs font-semibold text-ink-700 hover:bg-cream-100">WhatsApp</a>
              </div>
              <p className="mt-2 text-xs text-ink-500">Lien personnel à usage unique ({result.kind === "invite" ? "valable 7 jours" : "valable 24 h"}). Ne le publiez pas.</p>
            </div>
            <button onClick={() => setResult(null)} aria-label="Fermer" className="rounded-full p-1.5 text-ink-500 hover:bg-forest-100"><X className="h-4 w-4" /></button>
          </div>
        </section>
      )}

      {creating && (
        <form onSubmit={invite} className={cn(card, "mb-6 space-y-5")}>
          <h2 className="font-display text-lg font-semibold text-ink-900">Nouvel administrateur</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ad-name">Nom complet *</Label>
              <Input id="ad-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ad-email">Son adresse email personnelle *</Label>
              <Input id="ad-email" type="email" required placeholder="prenom.nom@exemple.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ad-preset">Profil type (pré-remplit les droits)</Label>
              <select id="ad-preset" value={form.preset} onChange={(e) => applyPreset(e.target.value)} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                <option value="">— Personnalisé —</option>
                {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ad-job">Fonction</Label>
              <Input id="ad-job" value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))} className="h-11 bg-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ce que cette personne peut faire</Label>
            <PermissionPicker value={perms} onChange={setPerms} />
            <p className="text-xs text-ink-500">Messagerie, profil et statistiques générales sont toujours accessibles. Elle ne pourra jamais gérer les autres administrateurs.</p>
          </div>
          <div className="space-y-2">
            <Label>Couleur du profil</Label>
            <ColorPicker value={form.color} onChange={(c) => setForm((f) => ({ ...f, color: c }))} />
          </div>
          <button type="submit" disabled={busy === "create"} className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
            {busy === "create" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <MailCheck className="h-4 w-4" aria-hidden="true" />}
            Créer et envoyer l&apos;invitation
          </button>
        </form>
      )}

      <ul className="space-y-4">
        {admins.map((a) => {
          const list = a.isDirector ? ALL_PERMISSIONS : parsePermissions(a.permissions);
          const isEditing = editing === a.id;
          return (
            <li key={a.id} className={cardClass(a)}>
              <div className="flex flex-wrap items-start gap-4">
                <Avatar name={a.name} color={a.avatarColor} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink-900">{a.name}</h3>
                    {a.isDirector && <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-600"><Crown className="h-3 w-3" aria-hidden="true" /> Directeur{a.id === myId ? " (vous)" : ""}</span>}
                    {!a.isDirector && a.invitePending && <span className="rounded-full bg-terra-100 px-2.5 py-0.5 text-xs font-semibold text-terra-700">Invitation en attente</span>}
                    {!a.isDirector && !a.invitePending && a.active && <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-semibold text-forest-700">Actif</span>}
                    {!a.active && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Suspendu</span>}
                  </div>
                  <p className="text-sm text-ink-500">{a.jobTitle ?? "Administrateur"} · {a.email}</p>
                  <p className="text-xs text-ink-400">{a.lastSeenAt ? `Dernière activité ${timeAgo(a.lastSeenAt)}` : "Jamais connecté"}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.isDirector ? (
                      <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs text-ink-700">Accès complet + gestion des administrateurs</span>
                    ) : list.length === 0 ? (
                      <span className="text-xs text-ink-400">Aucune section — messagerie et profil uniquement</span>
                    ) : (
                      list.map((k) => <span key={k} className="rounded-full bg-cream-200 px-2.5 py-1 text-xs text-ink-700">{permLabel(k)}</span>)
                    )}
                  </div>
                </div>

                {!a.isDirector && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button onClick={() => (isEditing ? setEditing(null) : startEdit(a))} title="Modifier les droits" aria-label={`Modifier ${a.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 hover:bg-cream-100"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => sendLink(a)} disabled={busy === a.id} title={a.invitePending ? "Renvoyer l'invitation" : "Envoyer un lien de nouveau mot de passe"} aria-label={`Envoyer un lien à ${a.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 hover:bg-cream-100 disabled:opacity-50"><KeyRound className="h-4 w-4" /></button>
                    <button onClick={() => toggleActive(a)} disabled={busy === a.id} title={a.active ? "Suspendre" : "Réactiver"} aria-label={a.active ? `Suspendre ${a.name}` : `Réactiver ${a.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 hover:bg-cream-100 disabled:opacity-50">{a.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}</button>
                    <button onClick={() => remove(a)} disabled={busy === a.id} title="Supprimer" aria-label={`Supprimer ${a.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-5 space-y-4 border-t border-cream-300 pt-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label>Nom</Label><Input value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} className="h-11 bg-white" /></div>
                    <div className="space-y-1.5"><Label>Fonction</Label><Input value={edit.jobTitle} onChange={(e) => setEdit((s) => ({ ...s, jobTitle: e.target.value }))} className="h-11 bg-white" /></div>
                  </div>
                  <div className="space-y-2"><Label>Droits</Label><PermissionPicker value={edit.perms} onChange={(v) => setEdit((s) => ({ ...s, perms: v }))} /></div>
                  <div className="space-y-2"><Label>Couleur</Label><ColorPicker value={edit.color} onChange={(c) => setEdit((s) => ({ ...s, color: c }))} /></div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(a)} disabled={busy === a.id} className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-60">{busy === a.id && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer</button>
                    <button onClick={() => setEditing(null)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-600 hover:bg-cream-100">Annuler</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <section className={cn(card, "mt-8")}>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900"><ShieldCheck className="h-5 w-5 text-terra-600" aria-hidden="true" /> Directeur ou administrateur : qui peut quoi ?</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-ink-400"><th className="py-2 pr-4 font-semibold">Action</th><th className="px-4 py-2 text-center font-semibold">Directeur</th><th className="px-4 py-2 text-center font-semibold">Administrateur</th></tr></thead>
            <tbody className="divide-y divide-cream-200">
              {[
                ["Inviter, modifier, suspendre ou supprimer des administrateurs", true, false],
                ["Accorder ou retirer des droits", true, false],
                ["Vider les données de démonstration", true, false],
                ["Régler la messagerie entre clients", true, false],
                ["Sections de travail (projets, devis, factures, contenu…)", true, "selon les droits accordés"],
                ["Messagerie, appels, profil, changer son mot de passe", true, true],
              ].map(([label, d, ad]) => (
                <tr key={String(label)}>
                  <td className="py-2.5 pr-4 text-ink-700">{label}</td>
                  <td className="px-4 py-2.5 text-center">{d ? <Check className="mx-auto h-4 w-4 text-forest-700" aria-label="Oui" /> : <X className="mx-auto h-4 w-4 text-ink-300" aria-label="Non" />}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-ink-600">{ad === true ? <Check className="mx-auto h-4 w-4 text-forest-700" aria-label="Oui" /> : ad === false ? <X className="mx-auto h-4 w-4 text-ink-300" aria-label="Non" /> : ad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function cardClass(a: Admin) {
  return cn("rounded-3xl border bg-card p-5 shadow-card sm:p-6", a.active ? "border-cream-300" : "border-red-200 opacity-80");
}
