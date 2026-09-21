"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/project-schema";
import { projectSchema } from "@/lib/validations/project";
import type { ProjectActionResult } from "@/types/project";

const projectIdSchema = z.uuid();

const unavailableMessage =
  "This project is unavailable. Refresh the page and try again.";

function parseProjectForm(formData: FormData) {
  if (!(formData instanceof FormData)) {
    return projectSchema.safeParse(null);
  }

  const rawBulletPoints = formData.get("bulletPoints") ?? "";

  const bulletPoints =
    typeof rawBulletPoints === "string"
      ? rawBulletPoints
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : rawBulletPoints;

  return projectSchema.safeParse({
    projectName: formData.get("projectName") ?? "",
    description: formData.get("description") ?? "",
    technologies: formData.getAll("technologies"),
    bulletPoints,
    projectUrl: formData.get("projectUrl") ?? "",
    repositoryUrl: formData.get("repositoryUrl") ?? "",
  });
}

export async function createProject(
  formData: FormData,
): Promise<ProjectActionResult> {
  const user = await requireUser();
  const parsed = parseProjectForm(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Check your project details and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await db.insert(projects).values({
      ...parsed.data,
      userId: user.id,
    });
  } catch {
    return {
      success: false,
      message: "Unable to add this project. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Project added.",
  };
}

export async function updateProject(
  projectId: string,
  formData: FormData,
): Promise<ProjectActionResult> {
  const user = await requireUser();
  const parsedId = projectIdSchema.safeParse(projectId);

  if (!parsedId.success) {
    return {
      success: false,
      message: unavailableMessage,
    };
  }

  const parsed = parseProjectForm(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Check your project details and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, parsedId.data), eq(projects.userId, user.id)))
      .returning({ id: projects.id });

    if (!updatedProject) {
      return {
        success: false,
        message: unavailableMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to update this project. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Project updated.",
  };
}

export async function deleteProject(
  projectId: string,
): Promise<ProjectActionResult> {
  const user = await requireUser();
  const parsedId = projectIdSchema.safeParse(projectId);

  if (!parsedId.success) {
    return {
      success: false,
      message: unavailableMessage,
    };
  }

  try {
    const [deletedProject] = await db
      .delete(projects)
      .where(and(eq(projects.id, parsedId.data), eq(projects.userId, user.id)))
      .returning({ id: projects.id });

    if (!deletedProject) {
      return {
        success: false,
        message: unavailableMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to delete this project. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Project deleted.",
  };
}
