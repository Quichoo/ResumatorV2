"use server";

import { requireUser } from "@/lib/auth-session";
import { consumeActionAttempt } from "@/lib/rate-limit";
import {
  extractResumeDraft,
  ResumeDraftError,
} from "@/lib/resume-import/extract-resume-draft";
import { MAX_RESUME_TEXT_LENGTH } from "@/lib/resume-import/limits";
import type { ExtractResumeDraftResult } from "@/types/resume-draft";

export async function extractResumeDraftAction(
  formData: FormData,
): Promise<ExtractResumeDraftResult> {
  const user = await requireUser();

  if (!(formData instanceof FormData)) {
    return {
      success: false,
      message: "Please provide your resume text.",
    };
  }

  const rawText = formData.get("text");

  if (typeof rawText !== "string") {
    return {
      success: false,
      message: "Please upload and preview your resume first.",
    };
  }

  const text = rawText.trim();

  if (!text || text.length > MAX_RESUME_TEXT_LENGTH) {
    return {
      success: false,
      message: `Resume text must contain between 1 and ${MAX_RESUME_TEXT_LENGTH.toLocaleString()} characters.`,
    };
  }

  try {
    const allowed = await consumeActionAttempt({
      userId: user.id,
      action: "resume-ai-extraction",
      limit: 3,
      windowSeconds: 60,
    });

    if (!allowed) {
      return {
        success: false,
        message:
          "You have made several extraction requests. Please wait a minute before trying again.",
      };
    }

    const draft = await extractResumeDraft(text);

    return {
      success: true,
      message: "Your resume draft is ready for review.",
      data: draft,
    };
  } catch (error) {
    if (error instanceof ResumeDraftError) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("Resume draft request failed.", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });

    return {
      success: false,
      message: "Unable to process your resume right now. Please try again.",
    };
  }
}
