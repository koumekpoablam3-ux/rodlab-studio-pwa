import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectEditor } from "./project-editor";

export const metadata = { title: "Détail projet" };
export const dynamic = "force-dynamic";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true, role: true, companyName: true, phone: true, avatarColor: true } },
      tasks: { orderBy: { order: "asc" } },
      quotes: { orderBy: { createdAt: "desc" }, select: { id: true, number: true, title: true, total: true, status: true } },
      invoices: { orderBy: { createdAt: "desc" }, select: { id: true, number: true, total: true, status: true } },
    },
  });

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <ProjectEditor project={project} />
    </div>
  );
}
