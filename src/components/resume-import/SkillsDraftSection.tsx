"use client";

import { Stack, Text, Title } from "@mantine/core";
import SkillFields from "@/components/skills/SkillFields";
import ImportSelectionCard from "@/components/ui/ImportSelectionCard";
import { skillSchema } from "@/lib/validations/skill";
import type { SkillFieldErrors, SkillReviewEntry } from "@/types/skill";

type SkillsDraftSectionProps = {
  entries: SkillReviewEntry[];
  selected: boolean[];
  onSelectedChange: (index: number, selected: boolean) => void;
  onEntryChange: (index: number, patch: Partial<SkillReviewEntry>) => void;
};

export default function SkillsDraftSection({
  entries,
  selected,
  onSelectedChange,
  onEntryChange,
}: SkillsDraftSectionProps) {
  const selectedNameCounts = new Map<string, number>();

  entries.forEach((entry, index) => {
    if (!selected[index]) return;

    const name = entry.name.trim().toLowerCase();

    if (name) {
      selectedNameCounts.set(name, (selectedNameCounts.get(name) ?? 0) + 1);
    }
  });

  return (
    <Stack gap="md">
      <div>
        <Title order={3}>Review skills</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Correct skill names and categories. Include each skill only once.
        </Text>
      </div>

      {entries.length === 0 && (
        <Text size="sm" c="dimmed">
          No skills were extracted.
        </Text>
      )}

      {entries.map((entry, index) => {
        const validation = skillSchema.safeParse(entry);
        const normalizedName = entry.name.trim().toLowerCase();

        const isDuplicate =
          Boolean(selected[index]) &&
          (selectedNameCounts.get(normalizedName) ?? 0) > 1;

        const fieldErrors: SkillFieldErrors = validation.success
          ? {}
          : validation.error.flatten().fieldErrors;

        if (isDuplicate) {
          fieldErrors.name = [
            ...(fieldErrors.name ?? []),
            "This skill is selected more than once. Rename or exclude a duplicate.",
          ];
        }

        const isValid = validation.success && !isDuplicate;

        return (
          <ImportSelectionCard
            key={index}
            title={`${index + 1}. ${entry.name.trim() || "Untitled skill"}`}
            selected={selected[index] ?? false}
            onSelectedChange={(checked) => onSelectedChange(index, checked)}
          >
            <Stack gap="md">
              <SkillFields
                values={entry}
                fieldErrors={fieldErrors}
                onValuesChange={(patch) => onEntryChange(index, patch)}
              />

              <Text size="sm" c={isValid ? "teal.9" : "red.8"}>
                {isValid
                  ? "Required fields are complete."
                  : "Fix the highlighted fields or exclude this skill."}
              </Text>
            </Stack>
          </ImportSelectionCard>
        );
      })}
    </Stack>
  );
}
