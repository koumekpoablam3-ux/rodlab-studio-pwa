import { db } from "@/lib/db";
import { ContentEditor } from "./content-editor";

export const metadata = { title: "Contenu du site" };
export const dynamic = "force-dynamic";

export default async function AdminContenuPage() {
  const contents = await db.siteContent.findMany({ orderBy: [{ section: "asc" }, { key: "asc" }] });
  return (
    <div className="mx-auto max-w-4xl">
      <ContentEditor initialContents={contents} />
    </div>
  );
}
