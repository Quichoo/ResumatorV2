import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumeGenerations, resumes } from "@/lib/db/schema";
import { validateTailoredResume } from "@/lib/resume-generation/validate-tailored-resume";
import { sortWorkExperiences } from "@/lib/utils/sort-work-experiences";
import {
  jobSnapshotSchema,
  profileSnapshotSchema,
} from "@/lib/validations/resume-snapshot";
import { normalizeTailoredResume } from "@/lib/resume-generation/normalize-tailored-resume";

export async function getLatestGeneratedResume(resumeId: string) {
  const user = await requireUser();

  if (!z.uuid().safeParse(resumeId).success) {
    return null;
  }

  const [generation] = await db
    .select({
      id: resumeGenerations.id,
      schemaVersion: resumeGenerations.schemaVersion,
      profileSnapshot: resumeGenerations.profileSnapshot,
      jobSnapshot: resumeGenerations.jobSnapshot,
      generatedDraft: resumeGenerations.generatedDraft,
      finishedAt: resumeGenerations.finishedAt,
    })
    .from(resumeGenerations)
    .innerJoin(resumes, eq(resumeGenerations.resumeId, resumes.id))
    .where(
      and(
        eq(resumeGenerations.resumeId, resumeId),
        eq(resumes.userId, user.id),
        eq(resumeGenerations.status, "completed"),
      ),
    )
    .orderBy(desc(resumeGenerations.createdAt), desc(resumeGenerations.id))
    .limit(1);

  if (!generation) {
    return null;
  }

  if (generation.schemaVersion !== 2) {
    throw new Error("This resume uses an unsupported draft version.");
  }

  const profile = profileSnapshotSchema.safeParse(generation.profileSnapshot);
  const job = jobSnapshotSchema.safeParse(generation.jobSnapshot);

  if (!profile.success || !job.success) {
    throw new Error("The saved resume snapshots could not be read.");
  }

  const parsed = validateTailoredResume(
    generation.generatedDraft,
    profile.data,
  );

  if (!parsed.success) {
    throw new Error("The saved resume draft could not be read.");
  }

  const snapshot = profile.data;
  const draft = normalizeTailoredResume(parsed.data);

  // Keep the server-defined snapshot order, not the AI's array order.
  const workExperiences = sortWorkExperiences(
    snapshot.workExperiences.map((entry) => {
      const tailored = draft.workExperiences.find(
        (item) => item.sourceId === entry.id,
      );

      if (!tailored) {
        throw new Error("A saved work experience is missing.");
      }

      return {
        ...entry,
        emphasis: tailored.emphasis,
        bulletPoints: tailored.bulletPoints,
      };
    }),
  );

  // Preserve the AI's selected project and skill order.
  const projects = draft.projects.map((entry) => {
    const source = snapshot.projects.find((item) => item.id === entry.sourceId);

    if (!source) {
      throw new Error("A saved project reference is invalid.");
    }

    return {
      ...source,
      bulletPoints: entry.bulletPoints,
    };
  });

  const skills = draft.skillIds.map((id) => {
    const skill = snapshot.skills.find((entry) => entry.id === id);

    if (!skill) {
      throw new Error("A saved skill reference is invalid.");
    }

    return skill;
  });

  return {
    generationId: generation.id,
    finishedAt: generation.finishedAt?.toISOString() ?? null,
    job: job.data,
    profile: snapshot.profile,
    summary: draft.summary,
    workExperiences,
    projects,
    skills,
    educationEntries: snapshot.educationEntries,
    certifications: snapshot.certifications,
  };
}

export type GeneratedResumeView = NonNullable<
  Awaited<ReturnType<typeof getLatestGeneratedResume>>
>;
