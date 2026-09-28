import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumeGenerations, resumes } from "@/lib/db/schema";
import { validateTailoredResume } from "@/lib/resume-generation/validate-tailored-resume";
import {
  jobSnapshotSchema,
  profileSnapshotSchema,
} from "@/lib/validations/resume-snapshot";

type GenerationFailureCode =
  | "INVALID_SNAPSHOT"
  | "AI_TIMEOUT"
  | "AI_FAILED"
  | "INVALID_OUTPUT"
  | "INTERRUPTED";

// Every operation checks the current user's ownership.
async function getOwnedGenerationFilter(generationId: string) {
  const user = await requireUser();

  if (!z.uuid().safeParse(generationId).success) {
    throw new Error("Invalid generation ID.");
  }

  const ownedResumes = db
    .select({ id: resumes.id })
    .from(resumes)
    .where(eq(resumes.userId, user.id));

  return and(
    eq(resumeGenerations.id, generationId),
    inArray(resumeGenerations.resumeId, ownedResumes),
  );
}

export async function failGeneration(
  generationId: string,
  failureCode: GenerationFailureCode,
): Promise<boolean> {
  const ownership = await getOwnedGenerationFilter(generationId);

  const rows = await db
    .update(resumeGenerations)
    .set({
      status: "failed",
      failureCode,
      generatedDraft: null,
      finishedAt: sql`now()`,
    })
    .where(and(ownership, eq(resumeGenerations.status, "running")))
    .returning({ id: resumeGenerations.id });

  return rows.length > 0;
}

export async function claimGeneration(generationId: string) {
  const ownership = await getOwnedGenerationFilter(generationId);

  // Recover an abandoned attempt when it is accessed again.
  // This is not a background worker.
  await db
    .update(resumeGenerations)
    .set({
      status: "failed",
      failureCode: "INTERRUPTED",
      generatedDraft: null,
      finishedAt: sql`now()`,
    })
    .where(
      and(
        ownership,
        eq(resumeGenerations.status, "running"),
        sql`
          ${resumeGenerations.startedAt}
          < now() - interval '5 minutes'
        `,
      ),
    );

  const [generation] = await db
    .update(resumeGenerations)
    .set({
      status: "running",
      startedAt: sql`now()`,
      finishedAt: null,
      failureCode: null,
      generatedDraft: null,
    })
    .where(and(ownership, eq(resumeGenerations.status, "pending")))
    .returning({
      id: resumeGenerations.id,
      schemaVersion: resumeGenerations.schemaVersion,
      profileSnapshot: resumeGenerations.profileSnapshot,
      jobSnapshot: resumeGenerations.jobSnapshot,
    });

  // Already running, completed, failed, absent, or not owned.
  if (!generation) {
    return null;
  }

  const profile = profileSnapshotSchema.safeParse(generation.profileSnapshot);
  const job = jobSnapshotSchema.safeParse(generation.jobSnapshot);

  if (generation.schemaVersion !== 2 || !profile.success || !job.success) {
    await failGeneration(generationId, "INVALID_SNAPSHOT");
    throw new Error("Generation snapshots are invalid.");
  }

  return {
    generationId: generation.id,
    profileSnapshot: profile.data,
    jobSnapshot: job.data,
  };
}

export async function completeGeneration(
  generationId: string,
  draft: unknown,
): Promise<boolean> {
  const ownership = await getOwnedGenerationFilter(generationId);

  const [generation] = await db
    .select({
      schemaVersion: resumeGenerations.schemaVersion,
      profileSnapshot: resumeGenerations.profileSnapshot,
    })
    .from(resumeGenerations)
    .where(and(ownership, eq(resumeGenerations.status, "running")))
    .limit(1);

  if (!generation) {
    return false;
  }

  const snapshot = profileSnapshotSchema.safeParse(generation.profileSnapshot);

  if (generation.schemaVersion !== 2 || !snapshot.success) {
    await failGeneration(generationId, "INVALID_SNAPSHOT");
    throw new Error("Generation snapshot is invalid.");
  }

  const parsed = validateTailoredResume(draft, snapshot.data);

  if (!parsed.success) {
    await failGeneration(generationId, "INVALID_OUTPUT");
    throw new Error("Generated resume failed validation.");
  }

  const rows = await db
    .update(resumeGenerations)
    .set({
      status: "completed",
      generatedDraft: parsed.data,
      failureCode: null,
      finishedAt: sql`now()`,
    })
    .where(and(ownership, eq(resumeGenerations.status, "running")))
    .returning({ id: resumeGenerations.id });

  return rows.length > 0;
}
