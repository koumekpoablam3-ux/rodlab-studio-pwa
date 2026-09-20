import { db } from "@/lib/db";
import { ProjectsBoard } from "./projects-board";

export const metadata = { title: "Projets" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    include: { client: { select: { id: true, name: true, email: true, companyName: true, role: true, avatarColor: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <ProjectsBoard initialProjects={projects} />
    </div>
  );
}
