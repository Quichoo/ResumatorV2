import "server-only";

import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/project-schema";
import type { Project } from "@/types/project";

export async function getProjects() {
  const user = await requireUser();

  try {
    const userProjects: Project[] = await db
      .select({
        id: projects.id,
        projectName: projects.projectName,
        description: projects.description,
        technologies: projects.technologies,
        bulletPoints: projects.bulletPoints,
        projectUrl: projects.projectUrl,
        repositoryUrl: projects.repositoryUrl,
      })
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.createdAt), desc(projects.id));

    return {
      success: true as const,
      projects: userProjects,
    };
  } catch {
    return {
      success: false as const,
      message: "Unable to load your projects. Please refresh and try again.",
    };
  }
}
