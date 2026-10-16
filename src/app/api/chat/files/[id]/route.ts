import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";

export const runtime = "nodejs";

// Seuls les formats « passifs » s'affichent dans la page ; tout le reste est téléchargé.
const INLINE = /^(image\/(jpeg|png|webp|gif)|audio\/(webm|ogg|mp4|mpeg|wav|x-m4a|aac))(;.*)?$/i;

/** Pièce jointe d'une conversation — accessible uniquement aux membres de cette conversation. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return new NextResponse("Non autorisé", { status: 401 });
  const { id } = await params;

  const msg = await db.directMessage.findFirst({
    where: { fileId: id, conversation: { members: { some: { userId: me.id } } } },
    select: { fileName: true },
  });
  if (!msg) return new NextResponse("Introuvable", { status: 404 });

  const file = await db.chatFile.findUnique({ where: { id } });
  if (!file) return new NextResponse("Introuvable", { status: 404 });

  const download = new URL(req.url).searchParams.get("download") === "1";
  const inline = !download && INLINE.test(file.mime);
  const filename = encodeURIComponent(msg.fileName || "fichier");

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${filename}`,
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
