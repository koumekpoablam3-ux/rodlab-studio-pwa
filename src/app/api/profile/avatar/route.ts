import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 800 * 1024; // le navigateur réduit déjà la photo à ~512 px
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

/** Retire l'ancienne photo de la base si elle avait été téléversée. */
async function dropOld(url: string | null | undefined) {
  const id = url?.match(/^\/api\/site-image\/([a-z0-9]+)$/i)?.[1];
  if (id) await db.siteImage.deleteMany({ where: { id } }).catch(() => {});
}

/** Téléverse ma photo de profil. */
export async function POST(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Aucune photo reçue" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Format non pris en charge (JPG, PNG ou WebP)" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Photo trop lourde (800 Ko maximum)" }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const image = await db.siteImage.create({ data: { mime: file.type, size: bytes.length, data: bytes }, select: { id: true } });
  const url = `/api/site-image/${image.id}`;

  const previous = await db.user.findUnique({ where: { id: me.id }, select: { avatarUrl: true } });
  await db.user.update({ where: { id: me.id }, data: { avatarUrl: url } });
  await dropOld(previous?.avatarUrl);
  return NextResponse.json({ url });
}

/** Retire ma photo de profil (retour aux initiales). */
export async function DELETE() {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const previous = await db.user.findUnique({ where: { id: me.id }, select: { avatarUrl: true } });
  await db.user.update({ where: { id: me.id }, data: { avatarUrl: null } });
  await dropOld(previous?.avatarUrl);
  return NextResponse.json({ ok: true });
}
