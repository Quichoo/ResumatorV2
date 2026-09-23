"use client";

import { Stack, Text, Title } from "@mantine/core";
import ProjectFields from "@/components/projects/ProjectFields";
import ImportSelectionCard from "@/components/ui/ImportSelectionCard";
import { prepareProjectReview } from "@/lib/resume-import/prepare-project-review";
import { projectSchema } from "@/lib/validations/project";
import type { ProjectFieldErrors, ProjectReviewEntry } from "@/types/project";

type ProjectDraftSectionProps = {
  entries: ProjectReviewEntry[];
  selected: boolean[];
  onSelectedChange: (index: number, selected: boolean) => void;
  onEntryChange: (index: number, patch: Partial<ProjectReviewEntry>) => void;
};

export default function ProjectDraftSection({
  entries,
  selected,
  onSelectedChange,
  onEntryChange,
}: ProjectDraftSectionProps) {
  return (
    <Stack gap="md">
      <div>
        <Title order={3}>Review projects</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Check each project&apos;s details, technologies, and contributions.
          Select the projects you want to import.
        </Text>
      </div>

      {entries.length === 0 && (
        <Text size="sm" c="dimmed">
          No projects were extracted.
        </Text>
      )}

      {entries.map((entry, index) => {
        const validation = projectSchema.safeParse(prepareProjectReview(entry));

        const fieldErrors: ProjectFieldErrors = validation.success
          ? {}
          : validation.error.flatten().fieldErrors;

        return (
          <ImportSelectionCard
            key={index}
            title={`${index + 1}. ${entry.projectName || "Untitled project"}`}
            selected={selected[index] ?? false}
            onSelectedChange={(checked) => onSelectedChange(index, checked)}
          >
            <Stack gap="md">
              <ProjectFields
                values={entry}
                fieldErrors={fieldErrors}
                onValuesChange={(patch) => onEntryChange(index, patch)}
              />

              <Text size="sm" c={validation.success ? "teal.9" : "red.8"}>
                {validation.success
                  ? "Required fields are complete."
                  : "Fix the highlighted fields or exclude this project."}
              </Text>
            </Stack>
          </ImportSelectionCard>
        );
      })}
    </Stack>
  );
}
