"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "./upload-image";

/** Aperçu + bouton « Changer la photo » (clic ou glisser-déposer). */
export function ImageField({
  value,
  onChange,
  onReset,
  label,
  aspect = "aspect-[16/10]",
  canReset = false,
}: {
  value: string;
  onChange: (url: string) => void;
  onReset?: () => void;
  label?: string;
  aspect?: string;
  canReset?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  async function handle(file?: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Photo chargée — pensez à enregistrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-ink-700">{label}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files?.[0]); }}
        className={`relative overflow-hidden rounded-2xl border bg-cream-100 ${aspect} ${over ? "border-terra-600 ring-2 ring-terra-600/30" : "border-cream-300"}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-300">Aucune photo</div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60"
        >
          <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" /> Changer la photo
        </button>
        {canReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2 text-xs font-medium text-ink-500 transition hover:bg-cream-100"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Photo d&apos;origine
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}
