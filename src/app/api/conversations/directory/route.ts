import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { clientsCanChat, PUBLIC_USER_SELECT, toPublicUser, touchPresence } from "@/lib/chat";

export const dynamic = "force-dynamic";

/** Annuaire : tous les comptes actifs avec qui on peut discuter, « en ligne » en premier. */
export async function GET(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await touchPresence(me.id);

  const q = new URL(req.url).searchParams.get("q")?.trim();
  const restricted = me.role !== "ADMIN" && !(await clientsCanChat());

  const users = await db.user.findMany({
    where: {
      active: true,
      id: { not: me.id },
      ...(restricted ? { role: "ADMIN" } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { companyName: { contains: q, mode: "insensitive" } }] } : {}),
    },
    select: PUBLIC_USER_SELECT,
    take: 300,
  });

  const list = users
    .map(toPublicUser)
    .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name, "fr"));

  return NextResponse.json({ users: list, restricted });
}
