import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// Vercel limite le corps d'une requête à ~4,5 Mo : l'éditeur redimensionne
// la photo dans le navigateur avant l'envoi, on garde donc une marge.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Téléversement d'une photo (ADMIN uniquement). Retourne l'URL publique. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin("content");
  if (!guard.ok) return guard.response;
  const session = { user: guard.user };

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Format non pris en charge (JPG, PNG, WebP ou GIF)" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Photo trop lourde (4 Mo maximum)" }, { status: 413 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const image = await db.siteImage.create({
      data: { mime: file.type, size: bytes.length, data: bytes },
      select: { id: true },
    });

    return NextResponse.json({ url: `/api/site-image/${image.id}` });
  } catch (error) {
    console.error("SITE_IMAGE_UPLOAD_ERROR", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la photo" }, { status: 500 });
  }
}
