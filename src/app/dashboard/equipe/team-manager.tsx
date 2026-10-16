"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, UsersRound, Building2, Mail, Phone, Briefcase, Ban, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import {PageHeader, EmptyState, StatusBadge} from "@/components/shared";
import { Avatar } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  status: string;
  invitedAt: string | Date;
  joinedAt: string | Date | null;
};

const STATUS_LABELS: Record<string, string> = { INVITED: "Invité", ACTIVE: "Actif", SUSPENDED: "Suspendu" };
const STATUS_COLORS: Record<string, string> = {
  INVITED: "bg-gold-100 text-gold-600 border-gold-200",
  ACTIVE: "bg-forest-100 text-forest-700 border-forest-200",
  SUSPENDED: "bg-red-100 text-red-700 border-red-200",
};

export function TeamManager({ members: initial }: { members: Member[] }) {
  const router = useRouter();
  const [members, setMembers] = useState(initial);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "" });

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Impossible d'ajouter le membre");
      return;
    }
    toast.success(
      data.member.status === "ACTIVE"
        ? `${data.member.name} a été rattaché à votre équipe (compte existant)`
        : `Invitation prête pour ${data.member.name} — il pourra rejoindre avec cet email`
    );
    setMembers((prev) => [data.member, ...prev]);
    setCreateOpen(false);
    setForm({ name: "", email: "", phone: "", position: "" });
    router.refresh();
  }

  async function toggleStatus(member: Member) {
    const next = member.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    const res = await fetch(`/api/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      toast.error("Action impossible");
      return;
    }
    toast.success(next === "SUSPENDED" ? `${member.name} suspendu` : `${member.name} réactivé`);
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: next } : m)));
  }

  async function removeMember(member: Member) {
    if (!confirm(`Retirer ${member.name} de votre équipe ?`)) return;
    const res = await fetch(`/api/team/${member.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Membre retiré");
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
  }

  const active = members.filter((m) => m.status === "ACTIVE").length;

  return (
    <>
      <PageHeader
        title="Notre équipe"
        description={`${members.length} membre(s) · ${active} actif(s). Les membres retrouvent les projets de ${""}l'entreprise avec leur propre compte.`}
        actions={
          <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter un membre
          </button>
        }
      />

      {members.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Aucun membre dans votre équipe"
          description="Ajoutez vos collaborateurs : ils disposeront d'un accès à l'espace de l'entreprise."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((m) => (
            <div key={m.id} className="rounded-3xl border border-cream-300 bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} color="#1b6fa8" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-ink-900">{m.name}</p>
                    <p className="truncate text-xs text-ink-500">{m.position ?? "Membre"}</p>
                  </div>
                </div>
                <StatusBadge label={STATUS_LABELS[m.status]} colorClass={STATUS_COLORS[m.status]} />
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-ink-700">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-ink-400" aria-hidden="true" />{m.email}</p>
                {m.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink-400" aria-hidden="true" />{m.phone}</p>}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-cream-200 pt-3">
                <button
                  onClick={() => toggleStatus(m)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:bg-cream-100"
                >
                  {m.status === "SUSPENDED" ? <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> : <Ban className="h-3.5 w-3.5" aria-hidden="true" />}
                  {m.status === "SUSPENDED" ? "Réactiver" : "Suspendre"}
                </button>
                <button
                  onClick={() => removeMember(m)}
                  aria-label={`Retirer ${m.name}`}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ——— Ajout ——— */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Ajouter un membre</DialogTitle>
          </DialogHeader>
          <form onSubmit={addMember} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tm-name">Nom complet *</Label>
                <Input id="tm-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tm-position">
                  <Briefcase className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Poste
                </Label>
                <Input id="tm-position" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder="Ex. Comptable" className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tm-email">
                  <Mail className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Email *
                </Label>
                <Input id="tm-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tm-phone">
                  <Phone className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Téléphone
                </Label>
                <Input id="tm-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11 bg-white" />
              </div>
            </div>
            <p className="rounded-2xl bg-cream-100 p-3.5 text-xs leading-relaxed text-ink-500">
              <Building2 className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              Si la personne possède déjà un compte RodLab avec cet email, elle est rattachée
              immédiatement. Sinon, elle sera marquée « invitée » : elle pourra créer son compte
              avec cet email pour rejoindre l&apos;équipe.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">Annuler</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Ajouter
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
