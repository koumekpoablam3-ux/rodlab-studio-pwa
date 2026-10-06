import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChatApp } from "@/components/chat/chat-app";
import { clientsCanChat } from "@/lib/chat";

export const metadata = { title: "Messagerie" };
export const dynamic = "force-dynamic";

export default async function AdminMessageriePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const [session, { c }, canChat] = await Promise.all([getServerSession(authOptions), searchParams, clientsCanChat()]);
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Messagerie</h1>
        <p className="mt-1 text-sm text-ink-500">
          Discutez, partagez des fichiers et appelez en audio ou en vidéo — avec n&apos;importe quel utilisateur, qu&apos;il vous ait écrit ou non.
        </p>
      </div>
      <ChatApp myId={session!.user.id} isAdmin initialConversationId={c ?? null} clientsCanChat={canChat} />
    </div>
  );
}
