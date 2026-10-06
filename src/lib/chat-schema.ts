import { db } from "@/lib/db";

/**
 * Tables de la messagerie v2, créées à la volée si `prisma db push` n'a pas encore
 * été lancé (même principe que bootstrap-schema.ts). Toutes les instructions sont
 * idempotentes (IF NOT EXISTS).
 */
export const CHAT_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS "Conversation" ( "id" TEXT NOT NULL PRIMARY KEY, "legacyThreadId" TEXT, "createdById" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Conversation_legacyThreadId_key" ON "Conversation"("legacyThreadId")`,
  `CREATE TABLE IF NOT EXISTS "ConversationMember" ( "conversationId" TEXT NOT NULL REFERENCES "Conversation"("id") ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ("conversationId", "userId") )`,
  `CREATE INDEX IF NOT EXISTS "ConversationMember_userId_idx" ON "ConversationMember"("userId")`,
  `CREATE TABLE IF NOT EXISTS "DirectMessage" ( "id" TEXT NOT NULL PRIMARY KEY, "conversationId" TEXT NOT NULL REFERENCES "Conversation"("id") ON DELETE CASCADE, "senderId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "type" TEXT NOT NULL DEFAULT 'TEXT', "content" TEXT NOT NULL DEFAULT '', "fileId" TEXT, "fileName" TEXT, "fileMime" TEXT, "fileSize" INTEGER, "duration" INTEGER, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP )`,
  `CREATE INDEX IF NOT EXISTS "DirectMessage_conversationId_createdAt_idx" ON "DirectMessage"("conversationId", "createdAt")`,
  `CREATE TABLE IF NOT EXISTS "ChatFile" ( "id" TEXT NOT NULL PRIMARY KEY, "mime" TEXT NOT NULL, "size" INTEGER NOT NULL, "data" BYTEA NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP )`,
  `CREATE TABLE IF NOT EXISTS "ChatTyping" ( "conversationId" TEXT NOT NULL, "userId" TEXT NOT NULL, "state" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ("conversationId", "userId") )`,
  `CREATE TABLE IF NOT EXISTS "CallSession" ( "id" TEXT NOT NULL PRIMARY KEY, "conversationId" TEXT NOT NULL, "callerId" TEXT NOT NULL, "calleeId" TEXT NOT NULL, "kind" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'RINGING', "callerPingAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "calleePingAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "answeredAt" TIMESTAMP(3), "endedAt" TIMESTAMP(3) )`,
  `CREATE INDEX IF NOT EXISTS "CallSession_calleeId_status_idx" ON "CallSession"("calleeId", "status")`,
  `CREATE INDEX IF NOT EXISTS "CallSession_callerId_status_idx" ON "CallSession"("callerId", "status")`,
  `CREATE TABLE IF NOT EXISTS "CallSignal" ( "id" TEXT NOT NULL PRIMARY KEY, "callId" TEXT NOT NULL, "fromId" TEXT NOT NULL, "toId" TEXT NOT NULL, "type" TEXT NOT NULL, "payload" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP )`,
  `CREATE INDEX IF NOT EXISTS "CallSignal_toId_callId_createdAt_idx" ON "CallSignal"("toId", "callId", "createdAt")`,
];

/**
 * Convertit chaque ancien fil (Message.threadId = id du client) en conversation.
 * Membres : le client + les admins ayant écrit dans le fil (ou le premier admin à défaut).
 * Les anciens vocaux (data URL base64) deviennent des pièces jointes ChatFile.
 * Idempotent grâce à Conversation.legacyThreadId (unique).
 */
export async function migrateLegacyMessages() {
  const threads = await db.message.groupBy({ by: ["threadId"] });
  if (threads.length === 0) return;

  const done = await db.conversation.findMany({
    where: { legacyThreadId: { in: threads.map((t) => t.threadId) } },
    select: { legacyThreadId: true },
  });
  const doneSet = new Set(done.map((d) => d.legacyThreadId));
  const todo = threads.map((t) => t.threadId).filter((id) => !doneSet.has(id));
  if (todo.length === 0) return;

  const firstAdmin = await db.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" }, select: { id: true } });

  for (const threadId of todo) {
    const client = await db.user.findUnique({ where: { id: threadId }, select: { id: true } });
    if (!client) continue; // client supprimé : rien à migrer

    const legacy = await db.message.findMany({ where: { threadId }, orderBy: { createdAt: "asc" } });
    if (legacy.length === 0) continue;

    const adminIds = Array.from(new Set(legacy.filter((m) => m.senderRole === "ADMIN").map((m) => m.senderId)));
    if (adminIds.length === 0 && firstAdmin) adminIds.push(firstAdmin.id);
    const memberIds = Array.from(new Set([client.id, ...adminIds]));

    // « Lu » : tout ce qui était déjà lu l'est ; le reste reste non lu pour son destinataire.
    const lastReadFor = (userId: string) => {
      const firstUnread = legacy.find((m) => m.senderId !== userId && !m.readAt);
      return firstUnread ? new Date(firstUnread.createdAt.getTime() - 1) : new Date();
    };

    try {
      const conversation = await db.conversation.create({
        data: {
          legacyThreadId: threadId,
          createdById: client.id,
          createdAt: legacy[0].createdAt,
          updatedAt: legacy[legacy.length - 1].createdAt,
          members: { create: memberIds.map((userId) => ({ userId, lastReadAt: lastReadFor(userId) })) },
        },
      });

      for (const m of legacy) {
        let fileId: string | null = null;
        let fileMime: string | null = null;
        let fileSize: number | null = null;
        if (m.type === "AUDIO") {
          const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(m.content);
          if (match) {
            const buf = Buffer.from(match[2], "base64");
            const file = await db.chatFile.create({ data: { mime: match[1], size: buf.length, data: buf }, select: { id: true } });
            fileId = file.id;
            fileMime = match[1];
            fileSize = buf.length;
          }
        }
        await db.directMessage.create({
          data: {
            conversationId: conversation.id,
            senderId: m.senderId,
            type: m.type === "AUDIO" ? "AUDIO" : "TEXT",
            content: m.type === "AUDIO" ? "" : m.content,
            fileId,
            fileMime,
            fileSize,
            duration: m.audioDuration ?? null,
            createdAt: m.createdAt,
          },
        });
      }
    } catch (error) {
      // course avec une autre instance (legacyThreadId unique) : on laisse l'autre terminer
      console.error("[chat] Migration du fil échouée :", threadId, error);
    }
  }
}
