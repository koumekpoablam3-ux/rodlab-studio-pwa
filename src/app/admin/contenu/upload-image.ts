/**
 * Prépare une photo dans le navigateur (redimensionnement + compression) puis
 * l'envoie à /api/admin/upload. Une photo de téléphone de 8 Mo devient ~300 Ko :
 * l'envoi reste sous la limite de 4 Mo de Vercel et le site charge plus vite.
 */
const MAX_SIDE = 2000;
const MAX_BYTES = 3.5 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image illisible")); };
    img.src = url;
  });
}

async function compress(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file; // GIF animé : envoyé tel quel
  const img = await loadImage(file);
  const ratio = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * ratio);
  const h = Math.round(img.naturalHeight * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Traitement d'image indisponible");
  ctx.fillStyle = "#ffffff"; // PNG transparents : fond blanc
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  for (const quality of [0.86, 0.75, 0.62, 0.5]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (blob && blob.size <= MAX_BYTES) return blob;
  }
  throw new Error("Photo trop lourde, même après compression");
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Ce fichier n'est pas une image");
  const blob = await compress(file);
  const form = new FormData();
  form.append("file", new File([blob], "photo.jpg", { type: blob.type }));
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error ?? "Échec de l'envoi de la photo");
  return data.url as string;
}
