"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumeGenerations, resumes } from "@/lib/db/schema";
import { createGeneration } from "@/lib/resume-generation/create-generation";
import {
  claimGeneration,
  completeGeneration,
  failGeneration,
} from "@/lib/resume-generation/generation-state";
import {
  generateTailoredResume,
  TailoringError,
} from "@/lib/resume-generation/generate-tailored-resume";
import type { GenerateResumeResult } from "@/types/resume-generation";

const requestSchema = z.object({
  resumeId: z.uuid(),
  requestId: z.uuid(),
});

export async function generateResumeAction(
  formData: FormData,
): Promise<GenerateResumeResult> {
  const user = await requireUser();

  const parsed = requestSchema.safeParse({
    resumeId: formData.get("resumeId"),
    requestId: formData.get("requestId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid generation request.",
      retryMode: "new",
    };
  }

  const { resumeId, requestId } = parsed.data;

  async function readCurrentResult(): Promise<GenerateResumeResult> {
    const [generation] = await db
      .select({
        id: resumeGenerations.id,
        status: resumeGenerations.status,
      })
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

    if (!generation) {
      return {
        success: false,
        message: "Generation not found. Start a new request.",
        retryMode: "new",
      };
    }

    if (generation.status === "completed") {
      return {
        success: true,
        generationId: generation.id,
        status: "completed",
        message: "Your tailored resume draft has been generated and saved.",
      };
    }

    if (generation.status === "running") {
      return {
        success: true,
        generationId: generation.id,
        status: "running",
        message:
          "This generation is still processing. Check its status shortly.",
      };
    }

    if (generation.status === "failed") {
      return {
        success: false,
        message:
          "This attempt did not finish successfully. You can start a new attempt.",
        retryMode: "new",
      };
    }

    return {
      success: false,
      message: "This generation is waiting to start. Please try again.",
      retryMode: "same",
    };
  }

  try {
    const created = await createGeneration(resumeId, requestId);

    if (!created.success) {
      return {
        success: false,
        message: created.message,
        retryMode: "new",
      };
    }

    const claimed = await claimGeneration(created.generationId);

    if (!claimed) {
      return await readCurrentResult();
    }

    const draft = await generateTailoredResume({
      profileSnapshot: claimed.profileSnapshot,
      jobSnapshot: claimed.jobSnapshot,
    });

    await completeGeneration(claimed.generationId, draft);

    return await readCurrentResult();
  } catch (error) {
    if (error instanceof TailoringError) {
      try {
        const failed = await failGeneration(requestId, error.code);

        if (failed) {
          return {
            success: false,
            message: error.message,
            retryMode: "new",
          };
        }

        return await readCurrentResult();
      } catch {
        console.error("Could not confirm the generation failure state.");
      }
    } else {
      console.error("Resume generation could not be completed or confirmed.");
    }

    // The database operation might have succeeded despite a lost response.
    // Keep the same request ID until its status can be confirmed.
    return {
      success: false,
      message:
        "Unable to confirm the generation status. Check again before starting another attempt.",
      retryMode: "same",
    };
  }
}
