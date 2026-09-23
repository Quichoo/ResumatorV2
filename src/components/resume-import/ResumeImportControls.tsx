"use client";

import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import type {
  ResumeImportIssue,
  SaveResumeImportResult,
} from "@/types/resume-import";

type ResumeImportControlsProps = {
  result: SaveResumeImportResult | null;
  isPending: boolean;
  isLocked: boolean;
  hasSelection: boolean;
  onSubmit: () => void;
};

const sectionLabels: Record<string, string> = {
  profile: "Personal details",
  workExperiences: "Selected work experience",
  educationEntries: "Selected education entry",
  projects: "Selected project",
  skills: "Selected skill",
  certifications: "Selected certification or course",
};

function describeIssue(issue: ResumeImportIssue) {
  const section = sectionLabels[String(issue.path[0])];

  if (!section) return issue.message;

  const index = issue.path[1];
  const entryNumber = typeof index === "number" ? ` ${index + 1}` : "";

  return `${section}${entryNumber}: ${issue.message}`;
}

export default function ResumeImportControls({
  result,
  isPending,
  isLocked,
  hasSelection,
  onSubmit,
}: ResumeImportControlsProps) {
  if (result?.success) {
    return (
      <Alert color="teal" title="Import saved" role="status">
        {result.message}
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      {isLocked && (
        <Alert color="blue" title="Submission locked">
          This submitted copy is kept unchanged for safe retries. Keep this page
          open and avoid clearing or replacing the resume until the save is
          confirmed.
        </Alert>
      )}

      {result && !result.success && (
        <Stack gap="xs">
          <ErrorMessage title="Import not completed" message={result.message} />

          {result.issues && result.issues.length > 0 && (
            <ul style={{ paddingInlineStart: "1.25rem" }}>
              {result.issues.map((issue, index) => (
                <li key={index}>
                  <Text size="sm">{describeIssue(issue)}</Text>
                </li>
              ))}
            </ul>
          )}
        </Stack>
      )}

      {isPending && <Loader label="Saving your selected details..." />}

      {!hasSelection && !isLocked && (
        <Text size="sm" c="dimmed">
          Select personal details or at least one entry to import.
        </Text>
      )}

      <Text size="sm" c="dimmed">
        Selected work experience, education, projects, and certifications will
        be added to your profile. Existing matching skills will be kept.
      </Text>

      <Group justify="flex-end">
        <Button
          type="button"
          color="blue.8"
          c={isPending || !hasSelection ? undefined : "white"}
          disabled={isPending || (!isLocked && !hasSelection)}
          onClick={onSubmit}
        >
          {isPending
            ? "Importing..."
            : isLocked
              ? "Retry import"
              : "Import selected details"}
        </Button>
      </Group>
    </Stack>
  );
}
