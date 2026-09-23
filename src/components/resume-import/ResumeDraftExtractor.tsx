"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import ResumeDraftReview from "@/components/resume-import/ResumeDraftReview";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import { useServerAction } from "@/hooks/useServerAction";
import { extractResumeDraftAction } from "@/lib/actions/resume-draft";

type ResumeDraftExtractorProps = {
  text: string;
};

export default function ResumeDraftExtractor({
  text,
}: ResumeDraftExtractorProps) {
  const { execute, isPending, result } = useServerAction(
    extractResumeDraftAction,
  );

  async function handleExtract() {
    if (isPending || result?.success) return;

    const formData = new FormData();
    formData.set("text", text);

    await execute(formData);
  }

  return (
    <Stack gap="md">
      {!result?.success && (
        <Group justify="flex-end">
          <Button
            type="button"
            color="blue.8"
            c={isPending ? undefined : "white"}
            leftSection={<IconSparkles size={18} aria-hidden />}
            onClick={handleExtract}
            disabled={isPending}
          >
            {isPending ? "Extracting..." : "Extract draft"}
          </Button>
        </Group>
      )}

      {isPending && (
        <Stack gap="xs">
          <Loader label="Extracting information from your resume..." />

          <Text size="sm" c="dimmed">
            This can take a minute or two.
          </Text>
        </Stack>
      )}

      {result && !result.success && (
        <ErrorMessage
          title="Draft could not be extracted"
          message={result.message}
        />
      )}

      {result?.success && <ResumeDraftReview initialDraft={result.data} />}
    </Stack>
  );
}
