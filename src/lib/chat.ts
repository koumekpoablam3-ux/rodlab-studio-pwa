import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";

/** Une personne est « en ligne » si elle a donné signe de vie il y a moins de 45 s. */
export const ONLINE_WINDOW_MS = 45_000;
export const TYPING_WINDOW_MS = 6_000;
/** Taille max d'une pièce jointe : Vercel plafonne les requêtes à ~4,5 Mo. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024;

export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  role: true,
  companyName: true,
  jobTitle: true,
  avatarColor: true,
  lastSeenAt: true,
} as const;

type PublicUserRow = {
  id: string;
  name: string;
  role: string;
  companyName: string | null;
  jobTitle: string | null;
  avatarColor: string | null;
  lastSeenAt: Date | null;
};

/** Ce que les autres utilisateurs ont le droit de voir : jamais l'email ni le téléphone. */
export function toPublicUser(u: PublicUserRow) {
  const online = !!u.lastSeenAt && Date.now() - u.lastSeenAt.getTime() < ONLINE_WINDOW_MS;
  return {
    id: u.id,
    name: u.role === "ENTREPRISE" ? u.companyName || u.name : u.name,
    role: u.role,
    subtitle: u.role === "ADMIN" ? u.jobTitle || "Équipe RodLab Studio" : u.role === "ENTREPRISE" ? u.name : u.jobTitle || "Client",
    avatarColor: u.avatarColor,
    online,
    lastSeenAt: u.lastSeenAt ? u.lastSeenAt.toISOString() : null,
  };
}

/** Met à jour « vu pour la dernière fois » (au plus une écriture toutes les 20 s par personne). */
export async function touchPresence(userId: string) {
  try {
    await db.user.updateMany({
      where: { id: userId, OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: new Date(Date.now() - 20_000) } }] },
      data: { lastSeenAt: new Date() },
    });
  } catch {
    // la présence ne doit jamais casser une requête
  }
}

/** Réglage admin : les clients ont-ils le droit de s'écrire entre eux ? (par défaut oui) */
export async function clientsCanChat(): Promise<boolean> {
  const row = await db.siteContent.findUnique({ where: { key: "chat.clientsCanChat" } }).catch(() => null);
  return row?.value !== "0";
}

export async function canChat(a: { id: string; role: string }, b: { id: string; role: string }) {
  if (a.id === b.id) return false;
  if (a.role === "ADMIN" || b.role === "ADMIN") return true;
  return clientsCanChat();
}

/** Retrouve la conversation à deux entre a et b, ou la crée. */
export async function getOrCreateDirect(aId: string, bId: string) {
  const existing = await db.conversation.findFirst({
    where: {
      AND: [{ members: { some: { userId: aId } } }, { members: { some: { userId: bId } } }],
      members: { none: { userId: { notIn: [aId, bId] } } },
    },
    select: { id: true },
  });
  if (existing) return existing.id;
  const created = await db.conversation.create({
    data: { createdById: aId, members: { create: [{ userId: aId }, { userId: bId }] } },
    select: { id: true },
  });
  return created.id;
}

/** La personne est-elle membre ? Retourne la conversation avec ses membres, sinon null. */
export async function getMemberConversation(conversationId: string, userId: string) {
  return db.conversation.findFirst({
    where: { id: conversationId, members: { some: { userId } } },
    include: { members: { include: { user: { select: PUBLIC_USER_SELECT } } } },
  });
}

export function messagePreview(m: { type: string; content: string; fileName?: string | null }) {
  switch (m.type) {
    case "IMAGE": return m.content ? `📷 ${m.content}` : "📷 Photo";
    case "FILE": return `📎 ${m.fileName || "Document"}`;
    case "AUDIO": return "🎤 Message vocal";
    case "CALL": return m.content.startsWith("VIDEO") ? "📹 Appel vidéo" : "📞 Appel audio";
    default: return m.content.length > 90 ? `${m.content.slice(0, 90)}…` : m.content;
  }
}

export function messagesUrlFor(role: string, conversationId: string) {
  return `${role === "ADMIN" ? "/admin" : "/dashboard"}/messagerie?c=${conversationId}`;
}

/** Notification push (sans email : un email par message serait du spam). */
export async function notifyMembers(
  conversationId: string,
  members: { userId: string; user: { role: string } }[],
  senderId: string,
  title: string,
  body: string,
  tag: string
) {
  await Promise.allSettled(
    members
      .filter((m) => m.userId !== senderId)
      .map((m) => notifyUser(m.userId, { title, body, url: messagesUrlFor(m.user.role, conversationId), tag, email: false }))
  );
}

/** URL d'une pièce jointe (accès réservé aux membres de la conversation). */
export const fileUrl = (fileId: string | null) => (fileId ? `/api/chat/files/${fileId}` : null);

/** Nombre total de messages non lus pour un utilisateur (badge du menu et tableaux de bord). */
export async function countUnread(userId: string): Promise<number> {
  try {
    const memberships = await db.conversationMember.findMany({ where: { userId }, select: { conversationId: true, lastReadAt: true } });
    const counts = await Promise.all(
      memberships.map((m) =>
        db.directMessage.count({ where: { conversationId: m.conversationId, senderId: { not: userId }, createdAt: { gt: m.lastReadAt } } })
      )
    );
    return counts.reduce((a, b) => a + b, 0);
  } catch {
    return 0; // tables pas encore créées : ne casse jamais une page
  }
}

/** Derniers messages des conversations d'un utilisateur (widget « Derniers échanges »). */
export async function recentMessagesFor(userId: string, take = 3) {
  try {
    const rows = await db.directMessage.findMany({
      where: { conversation: { members: { some: { userId } } } },
      orderBy: { createdAt: "desc" },
      take,
      include: { sender: { select: { name: true, role: true, companyName: true } } },
    });
    return rows.map((m) => ({
      id: m.id,
      createdAt: m.createdAt,
      content: messagePreview(m),
      mine: m.senderId === userId,
      senderName: m.sender.role === "ENTREPRISE" ? m.sender.companyName || m.sender.name : m.sender.name,
    }));
  } catch {
    return [];
  }
}

/** Derniers messages envoyés par des non-admins (widget « Derniers messages reçus » de l'admin). */
export async function recentClientMessages(take = 5) {
  try {
    const rows = await db.directMessage.findMany({
      where: { sender: { role: { not: "ADMIN" } }, type: { not: "CALL" } },
      orderBy: { createdAt: "desc" },
      take,
      include: { sender: { select: { id: true, name: true, companyName: true, role: true } } },
    });
    return rows.map((m) => ({ id: m.id, createdAt: m.createdAt, content: messagePreview(m), sender: m.sender }));
  } catch {
    return [];
  }
}
