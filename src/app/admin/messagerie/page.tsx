import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MessageChat } from "@/components/dashboard/message-chat";

export const metadata = { title: "Messagerie" };

export default async function AdminMessageriePage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Messagerie</h1>
        <p className="mt-1 text-sm text-ink-500">Échangez en direct avec vos clients — notifications push activées.</p>
      </div>
      <MessageChat variant="admin" myId={session!.user.id} />
    </div>
  );
}
