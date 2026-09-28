"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button, Stack, Text } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import { useServerAction } from "@/hooks/useServerAction";
import { generateResumeAction } from "@/lib/actions/generate-resume";

type GenerateResumeButtonProps = {
  resumeId: string;
};

export default function GenerateResumeButton({
  resumeId,
}: GenerateResumeButtonProps) {
  const router = useRouter();
  const requestIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  const { execute, isPending, result, clearResult } = useServerAction(
    generateResumeAction,
    {
      errorMessage:
        "The connection was interrupted. Check the generation status again.",
    },
  );

  const completed = result?.success && result.status === "completed";

  const storageKey = `resumator-generation:${resumeId}`;

  function getRequestId() {
    if (requestIdRef.current) {
      return requestIdRef.current;
    }

    try {
      requestIdRef.current = sessionStorage.getItem(storageKey);
    } catch {
      // Continue with in-memory retry protection if storage is unavailable.
    }

    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }

    try {
      sessionStorage.setItem(storageKey, requestIdRef.current);
    } catch {
      // The current component still retains the request ID.
    }

    return requestIdRef.current;
  }

  function clearRequestId() {
    requestIdRef.current = null;

    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Storage may be unavailable.
    }
  }

  function prepareAnotherDraft() {
    if (submittingRef.current || isPending) return;

    clearRequestId();
    clearResult();
  }

  async function handleGenerate() {
    if (submittingRef.current || isPending || completed) return;

    submittingRef.current = true;

    try {
      const formData = new FormData();
      formData.set("resumeId", resumeId);
      formData.set("requestId", getRequestId());

      const response = await execute(formData);

      if (response?.success && response.status === "completed") {
        router.refresh();
      }

      if (
        response &&
        !response.success &&
        "retryMode" in response &&
        response.retryMode === "new"
      ) {
        clearRequestId();
      }
    } finally {
      submittingRef.current = false;
    }
  }

  const canStartNewAttempt =
    result &&
    !result.success &&
    "retryMode" in result &&
    result.retryMode === "new";

  const buttonLabel = completed
    ? "Draft generated"
    : result?.success && result.status === "running"
      ? "Check generation status"
      : result && !result.success
        ? canStartNewAttempt
          ? "Try a new attempt"
          : "Check generation status"
        : "Generate tailored resume";

  return (
    <Stack gap="sm" align="flex-start">
      <Text size="sm" c="dimmed">
        Save any changes to the job details before generating.
      </Text>

      <Button
        type="button"
        color="blue.8"
        leftSection={<IconSparkles size={18} aria-hidden="true" />}
        onClick={handleGenerate}
        disabled={isPending || Boolean(completed)}
        loading={isPending}
      >
        {buttonLabel}
      </Button>

      {completed && (
        <Button
          type="button"
          variant="default"
          onClick={prepareAnotherDraft}
          disabled={isPending}
        >
          Prepare another draft
        </Button>
      )}

      {isPending && (
        <Loader label="Tailoring your resume. This may take up to two minutes..." />
      )}

      {result && !result.success && (
        <ErrorMessage
          title="Generation could not be completed"
          message={result.message}
        />
      )}

      {result?.success && (
        <Text
          size="sm"
          c={result.status === "completed" ? "teal.8" : "dimmed"}
          role="status"
        >
          {result.message}
        </Text>
      )}
    </Stack>
  );
}
