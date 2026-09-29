"use client";

import { useRef, useState } from "react";
import { Button, Stack, Text } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

type DownloadResumeButtonProps = {
  resumeId: string;
};

export default function DownloadResumeButton({
  resumeId,
}: DownloadResumeButtonProps) {
  const downloading = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (downloading.current) return;

    downloading.current = true;
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/pdf`, {
        cache: "no-store",
        signal: AbortSignal.timeout(60_000),
      });

      if (response.redirected || response.status === 401) {
        throw new Error(
          "Your session may have expired. Sign in again to download.",
        );
      }

      if (!response.ok) {
        let message = "Unable to download the PDF. Please try again.";

        try {
          const body: unknown = await response.json();

          if (
            body &&
            typeof body === "object" &&
            "message" in body &&
            typeof body.message === "string"
          ) {
            message = body.message;
          }
        } catch {
          // Keep the fallback message for non-JSON responses.
        }

        throw new Error(message);
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.toLowerCase().startsWith("application/pdf")) {
        throw new Error("The server did not return a PDF. Please try again.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition");
      const filename =
        disposition?.match(/filename="([^"]+)"/i)?.[1] ?? "resume.pdf";

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      try {
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();

        // Allow the browser time to start reading the download.
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error && error.name === "TimeoutError"
          ? "PDF preparation took too long. Please try again."
          : error instanceof Error
            ? error.message
            : "Unable to download the PDF. Please try again.",
      );
    } finally {
      downloading.current = false;
      setIsPending(false);
    }
  }

  return (
    <Stack gap={4} align="flex-start">
      <Button
        type="button"
        variant="subtle"
        color="blue.8"
        radius="md"
        h={42}
        leftSection={<IconDownload size={18} aria-hidden="true" />}
        loading={isPending}
        disabled={isPending}
        onClick={handleDownload}
      >
        {isPending ? "Preparing PDF..." : "Download PDF"}
      </Button>

      {error && (
        <Text size="xs" c="red.8" role="alert" maw={320}>
          {error}
        </Text>
      )}
    </Stack>
  );
}
