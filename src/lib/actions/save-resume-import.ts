"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { consumeActionAttempt } from "@/lib/rate-limit";
import {
  ImportRequestConflictError,
  saveValidatedImport,
} from "@/lib/resume-import/save-import";
import { resumeImportSchema } from "@/lib/validations/resume-import";
import type { SaveResumeImportResult } from "@/types/resume-import";

const MAX_IMPORT_BYTES = 512_000;

export async function saveResumeImport(
  formData: FormData,
): Promise<SaveResumeImportResult> {
  const user = await requireUser();

  if (!(formData instanceof FormData)) {
    return {
      success: false,
      message: "The import request is invalid.",
    };
  }

  const rawPayload = formData.get("payload");

  if (
    typeof rawPayload !== "string" ||
    Buffer.byteLength(rawPayload, "utf8") > MAX_IMPORT_BYTES
  ) {
    return {
      success: false,
      message: "The import is missing or too large. Select fewer entries.",
    };
  }

  let candidate: unknown;

  try {
    candidate = JSON.parse(rawPayload);
  } catch {
    return {
      success: false,
      message: "The import request could not be read.",
    };
  }

  const parsed = resumeImportSchema.safeParse(candidate);

  if (!parsed.success) {
    return {
      success: false,
      message: "Correct the selected entries before importing.",
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.map((part) =>
          typeof part === "number" ? part : String(part),
        ),
        message: issue.message,
      })),
    };
  }

  let outcome: "saved" | "already-imported";

  try {
    const allowed = await consumeActionAttempt({
      userId: user.id,
      action: "resume-import-save",
      limit: 6,
      windowSeconds: 60,
    });

    if (!allowed) {
      return {
        success: false,
        message: "Too many import attempts. Please wait a minute and retry.",
      };
    }

    outcome = await saveValidatedImport(user.id, parsed.data);
  } catch (error) {
    if (error instanceof ImportRequestConflictError) {
      return {
        success: false,
        message: error.message,
      };
    }

    // Avoid logging resume contents or SQL parameters.
    console.error("Resume import could not be confirmed.");

    return {
      success: false,
      message:
        "We could not confirm the import. Retry the same submission " +
        "so we can safely check whether it was saved.",
    };
  }

  try {
    revalidatePath("/profile");
  } catch {
    // A refresh failure must not turn a committed import into a
    // reported save failure.
    console.warn("Resume import saved, but profile refresh failed.");

    return {
      success: true,
      alreadyImported: outcome === "already-imported",
      message: "Your import is saved. Refresh the page to see your profile.",
    };
  }

  return {
    success: true,
    alreadyImported: outcome === "already-imported",
    message:
      outcome === "already-imported"
        ? "This import was already saved. No additional records were added."
        : "Your selected details were imported. Existing matching skills were kept.",
  };
}
