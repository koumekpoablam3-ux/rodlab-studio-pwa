import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** Sert une photo téléversée. L'identifiant change à chaque nouvel envoi : cache longue durée sûr. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await db.siteImage.findUnique({ where: { id } }).catch(() => null);
  if (!image) return new NextResponse("Introuvable", { status: 404 });

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mime,
      "Content-Length": String(image.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
