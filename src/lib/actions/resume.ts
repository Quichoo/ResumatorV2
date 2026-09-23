"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/resume-schema";
import { consumeActionAttempt } from "@/lib/rate-limit";
import { resumeSchema } from "@/lib/validations/resume";
import type { CreateResumeResult } from "@/types/resume";

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
