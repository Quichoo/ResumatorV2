"use server";

import { requireUser } from "@/lib/auth-session";
import { consumeActionAttempt } from "@/lib/rate-limit";
import {
  extractResumePdfText,
  ResumePdfError,
} from "@/lib/resume-import/extract-pdf-text";
import { getResumeFileError } from "@/lib/validations/resume-file";
import type { ExtractResumeTextResult } from "@/types/resume-import";

export async function extractResumeText(
  formData: FormData,
): Promise<ExtractResumeTextResult> {
  const user = await requireUser();

  if (!(formData instanceof FormData)) {
    return {
      success: false,
      message: "Choose a PDF file and try again.",
    };
  }

  const files = formData.getAll("resume");
  const file = files[0];

  if (files.length !== 1 || !(file instanceof File)) {
    return {
      success: false,
      message: "Choose one PDF file.",
    };
  }

  const fileError = getResumeFileError(file);

  if (fileError) {
    return {
      success: false,
      message: fileError,
    };
  }

  try {
    const allowed = await consumeActionAttempt({
      userId: user.id,
      action: "resume-pdf-extraction",
      limit: 5,
      windowSeconds: 60,
    });

    if (!allowed) {
      return {
        success: false,
        message:
          "You have made several upload attempts. Wait one minute and try again.",
      };
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const signature = new TextDecoder().decode(bytes.subarray(0, 5));

    if (signature !== "%PDF-") {
      return {
        success: false,
        message: "This file does not appear to be a valid PDF.",
      };
    }

    const data = await extractResumePdfText(bytes);

    return {
      success: true,
      message: "Your resume text is ready to review.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ResumePdfError
          ? error.message
          : "Unable to process your resume right now. Please try again.",
    };
  }
}
