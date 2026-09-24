"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/resume-schema";
import { consumeActionAttempt } from "@/lib/rate-limit";
import { resumeSchema } from "@/lib/validations/resume";
import type { CreateResumeResult, UpdateResumeResult } from "@/types/resume";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function createResume(
  formData: FormData,
): Promise<CreateResumeResult> {
  const user = await requireUser();

  const parsed = resumeSchema.safeParse({
    title: formData.get("title"),
    targetRole: formData.get("targetRole"),
    companyName: formData.get("companyName") ?? "",
    jobDescription: formData.get("jobDescription"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let resumeId: string;

  try {
    const allowed = await consumeActionAttempt({
      userId: user.id,
      action: "resume-create",
      limit: 10,
      windowSeconds: 60,
    });

    if (!allowed) {
      return {
        success: false,
        message: "You are creating resumes too quickly. Try again shortly.",
      };
    }

    const [created] = await db
      .insert(resumes)
      .values({
        ...parsed.data,
        userId: user.id,
      })
      .returning({ id: resumes.id });

    if (!created) {
      throw new Error("Resume insert returned no record.");
    }

    resumeId = created.id;
  } catch {
    console.error("Resume creation could not be confirmed.");

    return {
      success: false,
      message:
        "Unable to confirm whether your resume was created. " +
        "Check My resumes before trying again.",
    };
  }

  try {
    revalidatePath("/resumes");
  } catch {
    console.warn("Resume created, but the resume list could not be refreshed.");

    return {
      success: true,
      message: "Resume created. Refresh My resumes if it does not appear.",
      resumeId,
    };
  }

  return {
    success: true,
    message: "Resume created.",
    resumeId,
  };
}

export async function updateResume(
  resumeId: string,
  formData: FormData,
): Promise<UpdateResumeResult> {
  const user = await requireUser();

  if (!z.uuid().safeParse(resumeId).success) {
    return {
      success: false,
      message: "Resume not found.",
    };
  }

  const parsed = resumeSchema.safeParse({
    title: formData.get("title"),
    targetRole: formData.get("targetRole"),
    companyName: formData.get("companyName") ?? "",
    jobDescription: formData.get("jobDescription"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const allowed = await consumeActionAttempt({
      userId: user.id,
      action: "resume-update",
      limit: 20,
      windowSeconds: 60,
    });

    if (!allowed) {
      return {
        success: false,
        message: "You are saving too quickly. Try again shortly.",
      };
    }

    const [updated] = await db
      .update(resumes)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)))
      .returning({ id: resumes.id });

    if (!updated) {
      return {
        success: false,
        message: "Resume not found or no longer available.",
      };
    }
  } catch {
    console.error("Resume update could not be confirmed.");

    return {
      success: false,
      message: "Unable to confirm your changes were saved. Please try again.",
    };
  }

  try {
    revalidatePath("/resumes");
    revalidatePath(`/resumes/${resumeId}/edit`);
  } catch {
    console.warn("Resume saved, but page refresh could not be completed.");

    return {
      success: true,
      message: "Changes saved. Refresh the page to see updated details.",
    };
  }

  return {
    success: true,
    message: "Changes saved.",
  };
}
