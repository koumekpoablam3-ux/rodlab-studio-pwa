"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, ImagePlus, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/app/admin/contenu/image-field";
import { uploadImage } from "@/app/admin/contenu/upload-image";
import { ACCENT_OPTIONS, CATEGORY_OPTIONS, categoryLabel, type RealisationForm } from "@/lib/realisation-types";
import { cn } from "@/lib/utils";

type Item = RealisationForm & { id: string; slug: string };

const EMPTY: RealisationForm = {
  title: "", category: "web", client: "", year: String(new Date().getFullYear()), duration: "", summary: "", challenge: "", solution: "",
  image: "", gallery: [], liveUrl: "", results: [], features: [], tags: [], testimonialQuote: "", testimonialName: "", testimonialRole: "",
  accent: "terra", published: true,
};

const card = "rounded-3xl border border-cream-300 bg-card p-5 shadow-card sm:p-6";
const iconBtn = "flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100 disabled:opacity-40";
const selectCls = "h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none focus:border-terra-600";

export function RealisationsBoard({ items, exampleSlugs }: { items: Item[]; exampleSlugs: string[] }) {
  const router = useRouter();
  const [list, setList] = useState(items);
  useEffect(() => setList(items), [items]);

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<RealisationForm>(EMPTY);
  const [featuresText, setFeaturesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const editorTop = useRef<HTMLDivElement>(null);

  const set = <K extends keyof RealisationForm>(k: K, v: RealisationForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const exampleCount = list.filter((i) => exampleSlugs.includes(i.slug)).length;

  function openEditor(item?: Item) {
    const base = item ?? { ...EMPTY };
    setForm({ ...base });
    setFeaturesText(base.features.join("\n"));
    setTagsText(base.tags.join(", "));
    setEditingId(item ? item.id : "new");
    setTimeout(() => editorTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function api(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body !== undefined ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  async function save() {
    const payload: RealisationForm = {
      ...form,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      results: form.results.filter((r) => r.value.trim() && r.label.trim()),
    };
    const { id: _ignored, ...body } = payload;
    void _ignored;
    setSaving(true);
    const { ok, data } = editingId === "new" ? await api("/api/admin/realisations", "POST", body) : await api(`/api/admin/realisations/${editingId}`, "PATCH", body);
    setSaving(false);
    if (!ok) { toast.error(data.error ?? "Enregistrement impossible", { duration: 7000 }); return; }
    toast.success(editingId === "new" ? "Réalisation ajoutée — visible sur le site" : "Réalisation mise à jour");
    setEditingId(null);
    router.refresh();
  }

  async function togglePublished(item: Item) {
    setBusy(item.id);
    const { ok, data } = await api(`/api/admin/realisations/${item.id}`, "PATCH", { published: !item.published });
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Action impossible"); return; }
    toast.success(item.published ? "Réalisation masquée du site" : "Réalisation visible sur le site");
    router.refresh();
  }

  async function remove(item: Item) {
    if (!window.confirm(`Supprimer définitivement « ${item.title} » ?\n\nCette action est irréversible. Pour la retirer du site sans la perdre, utilisez plutôt « Masquer ».`)) return;
    setBusy(item.id);
    const { ok, data } = await api(`/api/admin/realisations/${item.id}`, "DELETE");
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Suppression impossible"); return; }
    toast.success("Réalisation supprimée");
    router.refresh();
  }

  async function removeExamples() {
    if (!window.confirm(`Supprimer les ${exampleCount} réalisations d'exemple (Kafo Market, Hôtel Palm Beach…) ?\n\nVos propres réalisations ne sont pas touchées. Action irréversible.`)) return;
    setBusy("examples");
    const { ok, data } = await api("/api/admin/realisations?examples=1", "DELETE");
    setBusy(null);
    if (!ok) { toast.error(data.error ?? "Suppression impossible"); return; }
    toast.success(`${data.deleted} exemple(s) supprimé(s)`);
    router.refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[index], next[j]] = [next[j], next[index]];
    setList(next);
    const { ok } = await api("/api/admin/realisations/reorder", "POST", { ids: next.map((i) => i.id) });
    if (!ok) { toast.error("Ordre non enregistré"); setList(items); return; }
    router.refresh();
  }

  async function addGallery(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: string[] = [];
    for (const f of Array.from(files)) {
      try { added.push(await uploadImage(f)); } catch (e) { toast.error(`${f.name} : ${e instanceof Error ? e.message : "échec"}`); }
    }
    if (added.length) set("gallery", [...form.gallery, ...added].slice(0, 12));
    setUploading(false);
    if (galleryInput.current) galleryInput.current.value = "";
  }

  const moveGallery = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= form.gallery.length) return;
    const g = [...form.gallery];
    [g[i], g[j]] = [g[j], g[i]];
    set("gallery", g);
  };

  return (
    <>
      <PageHeader
        title="Réalisations"
        description="Ajoutez vos vrais projets avec leurs photos : ils apparaissent sur la page Réalisations, l'accueil et le plan du site."
        actions={
          <button onClick={() => openEditor()} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter une réalisation
          </button>
        }
      />

      {exampleCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gold-300 bg-gold-50 p-5">
          <p className="max-w-xl text-sm text-ink-700">
            <strong>{exampleCount} réalisation(s) d&apos;exemple</strong> (données fictives livrées avec le projet) sont encore en ligne. Modifiez-les avec vos vraies informations, ou supprimez-les d&apos;un coup.
          </p>
          <button onClick={removeExamples} disabled={busy === "examples"} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {busy === "examples" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
            Supprimer les exemples
          </button>
        </div>
      )}

      <div ref={editorTop} />
      {editingId && (
        <section className={cn(card, "mb-8 space-y-7 border-terra-300")} aria-label="Éditeur de réalisation">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink-900">{editingId === "new" ? "Nouvelle réalisation" : "Modifier la réalisation"}</h2>
            <button onClick={() => setEditingId(null)} aria-label="Fermer l'éditeur" className="rounded-full p-2 text-ink-500 hover:bg-cream-100"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="r-title">Titre du projet *</Label>
              <Input id="r-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex. Site de la clinique Santé+" className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-cat">Type de projet</Label>
              <select id="r-cat" value={form.category} onChange={(e) => set("category", e.target.value as RealisationForm["category"])} className={selectCls}>
                {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-client">Client</Label>
              <Input id="r-client" value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Ex. Clinique Santé+ — Santé privée" className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-year">Année de livraison</Label>
              <Input id="r-year" value={form.year} onChange={(e) => set("year", e.target.value)} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-duration">Durée du projet</Label>
              <Input id="r-duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="Ex. 6 semaines" className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="r-url">Lien du projet en ligne (facultatif)</Label>
              <Input id="r-url" type="url" value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://www.leclient.com" className="h-11 bg-white" />
              <p className="text-xs text-ink-400">Un bouton « Voir le projet en ligne » s&apos;affichera sur la page du projet.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-ink-900">Photos du projet</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageField label="Photo de couverture *" value={form.image} onChange={(url) => set("image", url)} />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-700">Galerie ({form.gallery.length}/12) — captures d&apos;écran, photos…</p>
                  <button type="button" onClick={() => galleryInput.current?.click()} disabled={uploading || form.gallery.length >= 12} className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-50">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />} Ajouter
                  </button>
                  <input ref={galleryInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => addGallery(e.target.files)} />
                </div>
                {form.gallery.length === 0 ? (
                  <p className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-dashed border-cream-400 text-sm text-ink-400">Aucune image dans la galerie</p>
                ) : (
                  <ul className="grid grid-cols-3 gap-2">
                    {form.gallery.map((src, i) => (
                      <li key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-cream-300">
                        <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                          <button type="button" aria-label="Reculer" onClick={() => moveGallery(i, -1)} disabled={i === 0} className="rounded p-1 text-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5 -rotate-90" /></button>
                          <button type="button" aria-label="Retirer" onClick={() => set("gallery", form.gallery.filter((_, k) => k !== i))} className="rounded p-1 text-white"><Trash2 className="h-3.5 w-3.5" /></button>
                          <button type="button" aria-label="Avancer" onClick={() => moveGallery(i, 1)} disabled={i === form.gallery.length - 1} className="rounded p-1 text-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5 -rotate-90" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-ink-900">Présentation</h3>
            <div className="space-y-1.5">
              <Label htmlFor="r-summary">Résumé (affiché sur les cartes) *</Label>
              <Textarea id="r-summary" rows={3} maxLength={400} value={form.summary} onChange={(e) => set("summary", e.target.value)} className="bg-white" />
              <p className="text-right text-xs text-ink-400">{form.summary.length}/400</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="r-challenge">Le défi (situation de départ)</Label>
                <Textarea id="r-challenge" rows={5} value={form.challenge} onChange={(e) => set("challenge", e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-solution">Notre solution (ce que vous avez réalisé)</Label>
                <Textarea id="r-solution" rows={5} value={form.solution} onChange={(e) => set("solution", e.target.value)} className="bg-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-ink-900">Résultats chiffrés (jusqu&apos;à 4)</h3>
            <div className="space-y-2">
              {form.results.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <Input aria-label={`Valeur ${i + 1}`} value={r.value} placeholder="+85 %" onChange={(e) => set("results", form.results.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))} className="h-11 w-28 bg-white" />
                  <Input aria-label={`Libellé ${i + 1}`} value={r.label} placeholder="Réservations directes" onChange={(e) => set("results", form.results.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} className="h-11 flex-1 bg-white" />
                  <button type="button" aria-label="Retirer ce résultat" onClick={() => set("results", form.results.filter((_, k) => k !== i))} className={iconBtn}><X className="h-4 w-4" /></button>
                </div>
              ))}
              {form.results.length < 4 && (
                <button type="button" onClick={() => set("results", [...form.results, { value: "", label: "" }])} className="inline-flex items-center gap-2 rounded-full border border-cream-400 px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-cream-100">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Ajouter un résultat
                </button>
              )}
              <p className="text-xs text-ink-400">N&apos;indiquez que des chiffres réels et vérifiables.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="r-features">Fonctionnalités livrées (une par ligne)</Label>
              <Textarea id="r-features" rows={5} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Paiement Mobile Money\nEspace client\nMode hors-ligne"} className="bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-tags">Technologies (séparées par des virgules)</Label>
              <Textarea id="r-tags" rows={5} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Next.js, WordPress, Figma" className="bg-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-ink-900">Témoignage du client (facultatif)</h3>
            <div className="space-y-1.5">
              <Label htmlFor="r-quote">Citation</Label>
              <Textarea id="r-quote" rows={3} value={form.testimonialQuote} onChange={(e) => set("testimonialQuote", e.target.value)} className="bg-white" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="r-qname">Nom</Label><Input id="r-qname" value={form.testimonialName} onChange={(e) => set("testimonialName", e.target.value)} className="h-11 bg-white" /></div>
              <div className="space-y-1.5"><Label htmlFor="r-qrole">Fonction / entreprise</Label><Input id="r-qrole" value={form.testimonialRole} onChange={(e) => set("testimonialRole", e.target.value)} className="h-11 bg-white" /></div>
            </div>
            <p className="text-xs text-ink-400">N&apos;ajoutez un témoignage que si le client l&apos;a réellement donné et autorisé.</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cream-100 p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-700">Couleur</span>
              {ACCENT_OPTIONS.map((a) => (
                <button key={a.value} type="button" role="radio" aria-checked={form.accent === a.value} aria-label={a.label} onClick={() => set("accent", a.value)} style={{ backgroundColor: a.color }}
                  className={cn("h-8 w-8 rounded-full ring-offset-2 transition", form.accent === a.value && "ring-2 ring-ink-900")} />
              ))}
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
              Visible sur le site
              <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} aria-label="Visible sur le site" />
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />} Enregistrer
            </button>
            <button onClick={() => setEditingId(null)} className="rounded-full border border-cream-300 px-6 py-3 text-sm font-medium text-ink-600 hover:bg-cream-100">Annuler</button>
          </div>
        </section>
      )}

      {list.length === 0 ? (
        <div className={cn(card, "py-14 text-center")}>
          <p className="font-display text-lg font-semibold text-ink-900">Aucune réalisation pour l&apos;instant</p>
          <p className="mt-1 text-sm text-ink-500">La page Réalisations du site affiche « bientôt » tant que vous n&apos;en avez pas ajouté.</p>
          <button onClick={() => openEditor()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-terra-700"><Plus className="h-4 w-4" aria-hidden="true" /> Ajouter ma première réalisation</button>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((item, i) => (
            <li key={item.id} className={cn(card, "flex flex-wrap items-center gap-4", !item.published && "opacity-70")}>
              <img src={item.image || "/images/site/carousel-agence.jpg"} alt="" className="h-20 w-28 shrink-0 rounded-2xl border border-cream-300 object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-display text-base font-semibold text-ink-900">{item.title}</h3>
                  <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-xs text-ink-600">{categoryLabel(item.category)}</span>
                  {exampleSlugs.includes(item.slug) && <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-600">Exemple</span>}
                  {!item.published && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Masquée</span>}
                </div>
                <p className="truncate text-sm text-ink-500">{[item.client, item.year].filter(Boolean).join(" · ") || "—"}</p>
                <p className="text-xs text-ink-400">{item.gallery.length} image(s) dans la galerie</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Monter ${item.title}`} title="Monter" className={iconBtn}><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Descendre ${item.title}`} title="Descendre" className={iconBtn}><ArrowDown className="h-4 w-4" /></button>
                {item.published && <Link href={`/realisations/${item.slug}`} target="_blank" aria-label={`Voir ${item.title} sur le site`} title="Voir sur le site" className={iconBtn}><ExternalLink className="h-4 w-4" /></Link>}
                <button onClick={() => togglePublished(item)} disabled={busy === item.id} aria-label={item.published ? `Masquer ${item.title}` : `Afficher ${item.title}`} title={item.published ? "Masquer" : "Afficher"} className={iconBtn}>{item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                <button onClick={() => openEditor(item)} aria-label={`Modifier ${item.title}`} title="Modifier" className={iconBtn}><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(item)} disabled={busy === item.id} aria-label={`Supprimer ${item.title}`} title="Supprimer" className={cn(iconBtn, "border-red-200 text-red-600 hover:bg-red-50")}><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
