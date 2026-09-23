"use client";

import { useRef, useState } from "react";
import { saveResumeImport } from "@/lib/actions/save-resume-import";
import { resumeImportSchema } from "@/lib/validations/resume-import";
import type { SaveResumeImportResult } from "@/types/resume-import";

export function useResumeImport() {
  const payloadRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  const [isPending, setIsPending] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [result, setResult] = useState<SaveResumeImportResult | null>(null);

  async function submit(content: Record<string, unknown>) {
    if (inFlightRef.current || result?.success) return;

    inFlightRef.current = true;
    setIsPending(true);
    setResult(null);

    try {
      let payload = payloadRef.current;

      if (payload === null) {
        const candidate = {
          ...content,
          requestId: crypto.randomUUID(),
        };

        const validation = resumeImportSchema.safeParse(candidate);

        if (!validation.success) {
          setResult({
            success: false,
            message: "Correct the selected entries before importing.",
            issues: validation.error.issues.map((issue) => ({
              path: issue.path.map((part) =>
                typeof part === "number" ? part : String(part),
              ),
              message: issue.message,
            })),
          });
          return;
        }

        payload = JSON.stringify(candidate);
        payloadRef.current = payload;
        setIsLocked(true);
      }

      const formData = new FormData();
      formData.set("payload", payload);

      const response = await saveResumeImport(formData);
      setResult(response);
    } catch {
      setResult({
        success: false,
        message: payloadRef.current
          ? "We could not confirm the import. Retry this same submission."
          : "Unable to prepare the import. Please try again.",
      });
    } finally {
      inFlightRef.current = false;
      setIsPending(false);
    }
  }

  return {
    submit,
    result,
    isPending,
    isLocked,
  };
}
