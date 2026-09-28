import "server-only";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumeGenerations, resumes } from "@/lib/db/schema";
import { getGenerationInput } from "@/lib/queries/resume-generation";
import { consumeActionAttempt } from "@/lib/rate-limit";

type CreateGenerationResult =
  | {
      success: true;
      generationId: string;
    }
  | {
      success: false;
      message: string;
    };

const requestSchema = z.object({
  resumeId: z.uuid(),
  requestId: z.uuid(),
});

export async function createGeneration(
  resumeId: string,
  requestId: string,
): Promise<CreateGenerationResult> {
  const user = await requireUser();

  const parsed = requestSchema.safeParse({ resumeId, requestId });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid generation request.",
    };
  }

  async function findExistingGeneration() {
    const [existing] = await db
      .select({ id: resumeGenerations.id })
      .from(resumeGenerations)
      .innerJoin(resumes, eq(resumeGenerations.resumeId, resumes.id))
      .where(
        and(
          eq(resumeGenerations.id, requestId),
          eq(resumeGenerations.resumeId, resumeId),
          eq(resumes.userId, user.id),
        ),
      )
      .limit(1);

    return existing;
  }

  // A retry uses the original snapshots and generation.
  const existing = await findExistingGeneration();

  if (existing) {
    return {
      success: true,
      generationId: existing.id,
    };
  }

  const allowed = await consumeActionAttempt({
    userId: user.id,
    action: "resume-generation-create",
    limit: 5,
    windowSeconds: 600,
  });

  if (!allowed) {
    return {
      success: false,
      message: "Too many generation requests. Please try again in 10 minutes.",
    };
  }

  const input = await getGenerationInput(resumeId);

  if (!input.success) {
    return {
      success: false,
      message: input.message,
    };
  }

  const [generation] = await db
    .insert(resumeGenerations)
    .values({
      id: requestId,
      resumeId,
      schemaVersion: 2,
      profileSnapshot: input.profileSnapshot,
      jobSnapshot: input.jobSnapshot,
      status: "pending",
    })
    .onConflictDoNothing({
      target: resumeGenerations.id,
    })
    .returning({
      id: resumeGenerations.id,
    });

  if (generation) {
    return {
      success: true,
      generationId: generation.id,
    };
  }

  // Another request may have inserted the same ID concurrently.
  const concurrentGeneration = await findExistingGeneration();

  if (concurrentGeneration) {
    return {
      success: true,
      generationId: concurrentGeneration.id,
    };
  }

  return {
    success: false,
    message:
      "Unable to create this generation. Start a new generation request.",
  };
}
