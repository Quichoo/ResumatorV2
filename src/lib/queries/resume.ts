import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/resume-schema";
import { resumeGenerations } from "@/lib/db/resume-generation-schema";
import type { GetResumesResult, ResumeDetails } from "@/types/resume";

export async function getResumes(): Promise<GetResumesResult> {
  const user = await requireUser();

  try {
    const completedGenerations = db
      .select({
        resumeId: resumeGenerations.resumeId,
      })
      .from(resumeGenerations)
      .where(eq(resumeGenerations.status, "completed"))
      .groupBy(resumeGenerations.resumeId)
      .as("completed_generations");

    const rows = await db
      .select({
        id: resumes.id,
        title: resumes.title,
        targetRole: resumes.targetRole,
        companyName: resumes.companyName,
        updatedAt: resumes.updatedAt,
        hasGeneratedDraft: sql<boolean>`
          ${completedGenerations.resumeId} IS NOT NULL
        `,
      })
      .from(resumes)
      .leftJoin(
        completedGenerations,
        eq(completedGenerations.resumeId, resumes.id),
      )
      .where(eq(resumes.userId, user.id))
      .orderBy(desc(resumes.updatedAt), desc(resumes.id));

    return {
      success: true,
      resumes: rows.map((resume) => ({
        ...resume,
        updatedAt: resume.updatedAt.toISOString(),
      })),
    };
  } catch {
    console.error("Could not load resumes.");

    return {
      success: false,
      message: "Unable to load your resumes. Please try again.",
    };
  }
}

export async function getResumeById(
  resumeId: string,
): Promise<ResumeDetails | null> {
  const user = await requireUser();

  if (!z.uuid().safeParse(resumeId).success) {
    return null;
  }

  const [resume] = await db
    .select({
      id: resumes.id,
      title: resumes.title,
      targetRole: resumes.targetRole,
      companyName: resumes.companyName,
      jobDescription: resumes.jobDescription,
      createdAt: resumes.createdAt,
      updatedAt: resumes.updatedAt,
    })
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)))
    .limit(1);

  if (!resume) {
    return null;
  }

  return {
    ...resume,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };
}
