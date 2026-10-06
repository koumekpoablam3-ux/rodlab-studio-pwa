"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, LayoutTemplate, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageField } from "./image-field";
import { uploadImage } from "./upload-image";

type Content = { id: string; key: string; section: string; label: string; value: string; type: string };
type Field = { key: string; label: string; kind: "image" | "text" | "textarea" | "toggle"; def: string; value: string };
export type Group = { title: string; hint?: string; fields: Field[] };
type Special = { key: string; def: string; value: string };
type Slide = { src: string; alt: string };
type Member = { id?: string; name: string; role: string; bio: string; photo: string };

const SECTION_LABELS: Record<string, string> = {
  hero: "Section d'accueil (Hero)",
  stats: "Chiffres clés",
  contact: "Coordonnées affichées",
  cta: "Appel à l'action",
};

const TABS = [
  { id: "textes", label: "Textes d'accueil" },
  { id: "carousel", label: "Carrousel" },
  { id: "team", label: "Équipe" },
  { id: "agency", label: "Photos de l'agence" },
  { id: "services", label: "Services" },
  { id: "realisations", label: "Réalisations" },
  { id: "blog", label: "Blog" },
  { id: "testimonials", label: "Témoignages" },
  { id: "demo", label: "Données de démo" },
] as const;

function parse<T>(raw: string, fallback: T[]): T[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

const card = "rounded-3xl border border-cream-300 bg-card p-6 shadow-card";
const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream-300 text-ink-500 transition hover:bg-cream-100 disabled:opacity-30";

export function ContentEditor({
  isDirector,
  initialContents,
  groups,
  carousel,
  team,
}: {
  isDirector: boolean;
  initialContents: Content[];
  groups: Record<string, Group[]>;
  carousel: Special;
  team: Special;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingSlides, setUploadingSlides] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const slideInput = useRef<HTMLInputElement>(null);

  // Valeurs de départ et valeurs par défaut (seules les clés « résettables » ont un défaut).
  const { start, defs } = useMemo(() => {
    const start: Record<string, string> = {};
    const defs: Record<string, string> = {};
    for (const c of initialContents) start[c.key] = c.value;
    for (const list of Object.values(groups))
      for (const g of list)
        for (const f of g.fields) { start[f.key] = f.value; defs[f.key] = f.def; }
    for (const s of [carousel, team]) { start[s.key] = s.value; defs[s.key] = s.def; }
    return { start, defs };
  }, [initialContents, groups, carousel, team]);

  const [saved, setSaved] = useState(start);
  const [vals, setVals] = useState(start);

  const changedKeys = useMemo(() => Object.keys(vals).filter((k) => vals[k] !== saved[k]), [vals, saved]);
  const set = (key: string, value: string) => setVals((p) => ({ ...p, [key]: value }));

  const slides = parse<Slide>(vals[carousel.key], []);
  const members = parse<Member>(vals[team.key], []);
  const setSlides = (l: Slide[]) => set(carousel.key, JSON.stringify(l));
  const setMembers = (l: Member[]) => set(team.key, JSON.stringify(l));

  function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
    const j = i + dir;
    if (j < 0 || j >= list.length) return list;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  }

  async function addSlides(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingSlides(true);
    const added: Slide[] = [];
    for (const file of Array.from(files)) {
      try {
        added.push({ src: await uploadImage(file), alt: "Photo RodLab Studio" });
      } catch (e) {
        toast.error(`${file.name} : ${e instanceof Error ? e.message : "échec de l'envoi"}`);
      }
    }
    if (added.length > 0) {
      setSlides([...slides, ...added]);
      toast.success(`${added.length} photo(s) ajoutée(s) — pensez à enregistrer`);
    }
    setUploadingSlides(false);
    if (slideInput.current) slideInput.current.value = "";
  }

  async function cleanDemo() {
    if (!window.confirm("Supprimer définitivement les comptes clients de démonstration et toutes leurs données (projets, devis, factures, messages) ?\n\nCette action est irréversible.")) return;
    setCleaning(true);
    const res = await fetch("/api/admin/demo-cleanup", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setCleaning(false);
    if (!res.ok) {
      toast.error(data.error ?? "Échec de la suppression");
      return;
    }
    toast.success(`Supprimé : ${data.users} compte(s) de démo et ${data.requests} demande(s) de devis de démo`);
    router.refresh();
  }

  async function save() {
    if (changedKeys.length === 0) {
      toast.info("Aucune modification à enregistrer");
      return;
    }
    // Une valeur redevenue identique au défaut est supprimée : le site reprend l'original.
    const resetKeys = changedKeys.filter((k) => k in defs && vals[k] === defs[k]);
    const values = changedKeys.filter((k) => !resetKeys.includes(k)).map((k) => ({ key: k, value: vals[k] }));

    setSaving(true);
    const res = await fetch("/api/admin/site-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values, resetKeys }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Impossible d'enregistrer les modifications");
      return;
    }
    setSaved(vals);
    toast.success("Enregistré — visible immédiatement sur le site public");
    router.refresh();
  }

  function renderField(f: Field) {
    const edited = vals[f.key] !== f.def;
    if (f.kind === "toggle") {
      const hidden = vals[f.key] === "1";
      return (
        <label key={f.key} className="flex items-center justify-between gap-3 rounded-2xl border border-cream-300 bg-white px-4 py-3 md:col-span-2">
          <span className="text-sm font-medium text-ink-700">
            {f.label}
            <span className="block text-xs font-normal text-ink-400">
              {hidden ? "Actuellement masqué : les visiteurs ne le voient plus." : "Actuellement visible sur le site."}
            </span>
          </span>
          <Switch checked={hidden} onCheckedChange={(on) => set(f.key, on ? "1" : "")} aria-label={f.label} />
        </label>
      );
    }
    if (f.kind === "image") {
      return (
        <ImageField
          key={f.key}
          label={f.label}
          value={vals[f.key]}
          onChange={(url) => set(f.key, url)}
          onReset={() => set(f.key, f.def)}
          canReset={edited}
        />
      );
    }
    return (
      <div key={f.key} className="space-y-1.5">
        <Label htmlFor={`f-${f.key}`}>{f.label}</Label>
        {f.kind === "textarea" ? (
          <Textarea id={`f-${f.key}`} rows={3} value={vals[f.key]} onChange={(e) => set(f.key, e.target.value)} className="bg-white" />
        ) : (
          <Input id={`f-${f.key}`} value={vals[f.key]} onChange={(e) => set(f.key, e.target.value)} className="h-11 bg-white" />
        )}
        {edited && (
          <button type="button" onClick={() => set(f.key, f.def)} className="text-xs text-terra-600 hover:underline">
            Rétablir le texte d&apos;origine
          </button>
        )}
      </div>
    );
  }

  const legacy = useMemo(() => {
    const map = new Map<string, Content[]>();
    for (const c of initialContents) {
      if (!map.has(c.section)) map.set(c.section, []);
      map.get(c.section)!.push(c);
    }
    return Array.from(map.entries());
  }, [initialContents]);

  return (
    <>
      <PageHeader
        title="Contenu du site"
        description="Changez les photos et les textes du site public : carrousel, équipe, services, réalisations, blog…"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVals(saved)}
              disabled={changedKeys.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2.5 text-sm font-medium text-ink-500 transition hover:bg-cream-100 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Annuler
            </button>
            <button
              onClick={save}
              disabled={saving || changedKeys.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              Enregistrer {changedKeys.length > 0 && `(${changedKeys.length})`}
            </button>
          </div>
        }
      />

      <Tabs defaultValue="carousel" className="gap-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-max flex-nowrap gap-1 bg-cream-100 p-1">
            {TABS.filter((t) => t.id !== "demo" || isDirector).map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="whitespace-nowrap px-4 py-2">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ———— Textes d'accueil (champs historiques) ———— */}
        <TabsContent value="textes" className="space-y-6">
          {legacy.map(([section, items]) => (
            <section key={section} className={card}>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                <LayoutTemplate className="h-5 w-5 text-terra-600" aria-hidden="true" />
                {SECTION_LABELS[section] ?? section}
              </h2>
              <div className="mt-5 grid gap-5">
                {items.map((c) => (
                  <div key={c.key} className="space-y-1.5">
                    <Label htmlFor={`ct-${c.key}`}>{c.label}</Label>
                    {c.key === "hero.subtitle" || (vals[c.key] ?? "").length > 90 ? (
                      <Textarea id={`ct-${c.key}`} rows={3} value={vals[c.key] ?? ""} onChange={(e) => set(c.key, e.target.value)} className="resize-none bg-white" />
                    ) : (
                      <Input id={`ct-${c.key}`} value={vals[c.key] ?? ""} onChange={(e) => set(c.key, e.target.value)} className="h-11 bg-white" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>

        {/* ———— Carrousel ———— */}
        <TabsContent value="carousel" className="space-y-4">
          <section className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-900">Carrousel de l&apos;accueil</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Les photos défilent toutes les 5 secondes derrière le titre. Format paysage recommandé (1920 × 1080).
                </p>
              </div>
              <div className="flex gap-2">
                {vals[carousel.key] !== carousel.def && (
                  <button type="button" onClick={() => set(carousel.key, carousel.def)} className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2 text-xs font-medium text-ink-500 hover:bg-cream-100">
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Photos d&apos;origine
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => slideInput.current?.click()}
                  disabled={uploadingSlides}
                  className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-60"
                >
                  {uploadingSlides ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />}
                  Ajouter des photos
                </button>
                <input ref={slideInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => addSlides(e.target.files)} />
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {slides.map((s, i) => (
                <div key={`${s.src}-${i}`} className="space-y-2 rounded-2xl border border-cream-300 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink-500">Photo {i + 1}</span>
                    <div className="flex gap-1.5">
                      <button type="button" aria-label="Monter" className={iconBtn} disabled={i === 0} onClick={() => setSlides(move(slides, i, -1))}><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button type="button" aria-label="Descendre" className={iconBtn} disabled={i === slides.length - 1} onClick={() => setSlides(move(slides, i, 1))}><ArrowDown className="h-3.5 w-3.5" /></button>
                      <button type="button" aria-label="Retirer" className={iconBtn} disabled={slides.length <= 1} onClick={() => setSlides(slides.filter((_, k) => k !== i))}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <ImageField value={s.src} onChange={(url) => setSlides(slides.map((x, k) => (k === i ? { ...x, src: url } : x)))} />
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* ———— Équipe ———— */}
        <TabsContent value="team" className="space-y-4">
          <section className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-900">Notre équipe</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Affichée sur la page « À propos ». Le premier membre est aussi l&apos;auteur des articles du blog. Portrait vertical recommandé.
                </p>
              </div>
              <div className="flex gap-2">
                {vals[team.key] !== team.def && (
                  <button type="button" onClick={() => set(team.key, team.def)} className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2 text-xs font-medium text-ink-500 hover:bg-cream-100">
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Équipe d&apos;origine
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMembers([...members, { name: "Nouveau membre", role: "Fonction", bio: "", photo: "" }])}
                  className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Ajouter un membre
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {members.map((m, i) => {
                const upd = (patch: Partial<Member>) => setMembers(members.map((x, k) => (k === i ? { ...x, ...patch } : x)));
                return (
                  <div key={i} className="space-y-3 rounded-2xl border border-cream-300 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink-500">Membre {i + 1}</span>
                      <div className="flex gap-1.5">
                        <button type="button" aria-label="Monter" className={iconBtn} disabled={i === 0} onClick={() => setMembers(move(members, i, -1))}><ArrowUp className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Descendre" className={iconBtn} disabled={i === members.length - 1} onClick={() => setMembers(move(members, i, 1))}><ArrowDown className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Retirer" className={iconBtn} disabled={members.length <= 1} onClick={() => setMembers(members.filter((_, k) => k !== i))}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <ImageField aspect="aspect-[4/3]" value={m.photo} onChange={(url) => upd({ photo: url })} />
                    <div className="space-y-1.5">
                      <Label>Nom</Label>
                      <Input value={m.name} onChange={(e) => upd({ name: e.target.value })} className="h-11 bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Fonction</Label>
                      <Input value={m.role} onChange={(e) => upd({ role: e.target.value })} className="h-11 bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Présentation</Label>
                      <Textarea rows={3} value={m.bio} onChange={(e) => upd({ bio: e.target.value })} className="bg-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        {/* ———— Données de démonstration ———— */}
        <TabsContent value="demo" className="space-y-4">
          <section className={card}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Données de démonstration</h2>
            <p className="mt-1 text-sm text-ink-500">
              Le projet est livré avec des clients, projets, devis, factures, messages et demandes fictifs.
              Vous pouvez les supprimer en une fois ici, ou un par un depuis chaque section (Clients, Projets, Devis, Factures, Demandes).
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-600">
              <li>Comptes clients de démo : kossi@chezkossi.tg, ayaba@adjale-boutique.tg, contact@hotelpalma.tg, comptabilite@hotelpalma.tg</li>
              <li>Avec eux, leurs projets, devis, factures, messages et collaborateurs</li>
              <li>Les 5 demandes de devis de démo</li>
            </ul>
            <p className="mt-4 rounded-2xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-ink-700">
              Vos comptes administrateur ne sont <strong>jamais</strong> supprimés par ce bouton. Pensez à changer le mot de passe
              des comptes <span className="font-mono">admin@rodlabstudio.tg</span> et <span className="font-mono">directeur@rodlabstudio.tg</span> (mot de passe de démo connu : <span className="font-mono">demo1234</span>) depuis « Mon profil » ou « Équipe &amp; comptes ».
            </p>
            <button
              type="button"
              onClick={cleanDemo}
              disabled={cleaning}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {cleaning ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
              Supprimer les données de démo
            </button>
            <p className="mt-3 text-xs text-ink-400">
              Les réalisations, articles et témoignages d&apos;exemple du site public se masquent depuis les onglets « Réalisations », « Blog » et « Témoignages » (interrupteur « Masquer »).
            </p>
          </section>
        </TabsContent>

        {/* ———— Autres onglets générés depuis le registre ———— */}
        {(["agency", "services", "realisations", "blog", "testimonials"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-6">
            {(groups[tab] ?? []).map((g) => (
              <section key={g.title} className={card}>
                <h2 className="font-display text-lg font-semibold text-ink-900">{g.title}</h2>
                {g.hint && <p className="mt-1 text-sm text-ink-500">{g.hint}</p>}
                <div className="mt-5 grid gap-5 md:grid-cols-2">{g.fields.map(renderField)}</div>
              </section>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
